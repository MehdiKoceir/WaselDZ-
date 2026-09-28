import { Order, Driver } from '../types';
import { STATUS_LABELS, PAYMENT_LABELS } from '../data/algeriaData';

export interface CsvExportOptions {
  separator?: ';' | ',';
  includeAccountingTotals?: boolean;
  type?: 'accounting' | 'compact';
  customFilename?: string;
}

/**
 * Escapes a cell value for CSV formatting.
 * Properly wraps in quotes if it contains separators, quotes, or newlines,
 * and escapes double quotes by doubling them.
 */
function escapeCsvCell(value: any, separator: string): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).trim().replace(/\r?\n|\r/g, ' ');
  // Always wrap text containing separator, quotes, or spaces in double quotes
  if (str.includes(separator) || str.includes('"') || str.includes('\n') || str.includes(';')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Generates and downloads a CSV file optimized for merchant accounting and Excel.
 */
export function exportOrdersToCsv(
  orders: Order[],
  drivers: Driver[] = [],
  options: CsvExportOptions = {}
): { count: number; totalAmount: number; netMerchant: number; totalDeliveryFees: number } {
  const separator = options.separator || ';';
  const includeTotals = options.includeAccountingTotals ?? true;

  // Calculate summary metrics
  const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalDeliveryFees = orders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
  const netMerchant = orders.reduce((sum, o) => sum + ((o.subtotal || (o.totalAmount - o.deliveryFee)) || 0), 0);
  const totalItemCount = orders.reduce((sum, o) => {
    return sum + (o.items ? o.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) : 1);
  }, 0);

  // Headers for detailed merchant accounting
  const headers = [
    'Reference_Commande',
    'Numero_Suivi',
    'Date_Commande',
    'Heure_Commande',
    'Nom_Client',
    'Telephone_Client',
    'Wilaya_Destination',
    'Commune_Destination',
    'Adresse_Complete',
    'Articles_Details',
    'Quantite_Totale_Articles',
    'Sous_Total_Articles_DZD',
    'Frais_Livraison_DZD',
    'Montant_Total_COD_DZD',
    'Net_Commercant_DZD',
    'Mode_Paiement',
    'Statut_Paiement',
    'Statut_Livraison',
    'Livreur_Assigne',
    'Telephone_Livreur',
    'Remarques'
  ];

  // Map driver lookup
  const driverMap = new Map<string, Driver>();
  drivers.forEach(d => driverMap.set(d.id, d));

  const rows = orders.map(order => {
    const driver = order.driverId ? driverMap.get(order.driverId) : null;
    const statusLabel = STATUS_LABELS[order.status]?.label || order.status;
    const paymentLabel = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || 'Espèces C.O.D';
    const paymentStatusLabel = order.paymentStatus === 'paid' ? 'Encaissé' : 'À encaisser';

    // Format items details: "2x T-Shirt (2000 DA) | 1x Pantalon (3500 DA)"
    const itemsDescription = order.items && order.items.length > 0
      ? order.items.map(item => `${item.quantity}x ${item.name} (${item.price * item.quantity} DA)`).join(' | ')
      : 'Commande standard';

    const orderItemCount = order.items && order.items.length > 0
      ? order.items.reduce((sum, i) => sum + (i.quantity || 1), 0)
      : 1;

    const dateObj = new Date(order.createdAt);
    const dateFormatted = !isNaN(dateObj.getTime())
      ? dateObj.toISOString().slice(0, 10)
      : order.createdAt;
    const timeFormatted = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : '';

    const orderSubtotal = order.subtotal ?? (order.totalAmount - order.deliveryFee);
    const orderNetMerchant = orderSubtotal;

    return [
      escapeCsvCell(order.id, separator),
      escapeCsvCell(order.trackingNumber, separator),
      escapeCsvCell(dateFormatted, separator),
      escapeCsvCell(timeFormatted, separator),
      escapeCsvCell(order.customerName, separator),
      escapeCsvCell(order.customerPhone, separator),
      escapeCsvCell(order.wilaya, separator),
      escapeCsvCell(order.commune, separator),
      escapeCsvCell(order.customerAddress || '', separator),
      escapeCsvCell(itemsDescription, separator),
      orderItemCount,
      orderSubtotal,
      order.deliveryFee,
      order.totalAmount,
      orderNetMerchant,
      escapeCsvCell(paymentLabel, separator),
      escapeCsvCell(paymentStatusLabel, separator),
      escapeCsvCell(statusLabel, separator),
      escapeCsvCell(driver ? driver.name : 'Non assigné', separator),
      escapeCsvCell(driver ? driver.phone : '', separator),
      escapeCsvCell(order.notes || '', separator)
    ].join(separator);
  });

  // Optional totals accounting summary row at the bottom
  if (includeTotals && orders.length > 0) {
    const totalRow = [
      escapeCsvCell('TOTAL_GENERAL', separator),
      escapeCsvCell(`TOTAL (${orders.length} commandes)`, separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('TOTAL_ARTICLES', separator),
      totalItemCount,
      netMerchant,
      totalDeliveryFees,
      totalAmount,
      netMerchant,
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator),
      escapeCsvCell('', separator)
    ].join(separator);

    rows.push(totalRow);
  }

  // Prepend UTF-8 BOM so Excel opens with French & Arabic characters correctly
  const csvContent = '\uFEFF' + [headers.join(separator), ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const todayStr = new Date().toISOString().slice(0, 10);
  const filename = options.customFilename || `waseldz-comptabilite-commandes-${todayStr}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    count: orders.length,
    totalAmount,
    netMerchant,
    totalDeliveryFees
  };
}
