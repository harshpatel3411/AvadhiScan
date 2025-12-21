const BARCODE_API_KEY = process.env.BARCODE_API_KEY || 'fallback-api-key';
const BARCODE_API_URL = process.env.BARCODE_API_URL || 'https://api.upcitemdb.com/prod/trial/lookup';

export interface BarcodeProduct {
  title: string;
  brand?: string;
  category?: string;
  description?: string;
}

export const lookupBarcode = async (barcode: string): Promise<BarcodeProduct | null> => {
  try {
    const response = await fetch(`${BARCODE_API_URL}?upc=${barcode}`, {
      headers: {
        'Authorization': `Bearer ${BARCODE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Barcode API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        title: item.title || 'Unknown Product',
        brand: item.brand || undefined,
        category: item.category || 'other',
        description: item.description || undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return null;
  }
};
