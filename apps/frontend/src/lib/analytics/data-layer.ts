declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

type DataLayerEvent = {
  event: string;
  [key: string]: any;
};

export const pushToDataLayer = (data: DataLayerEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

export const trackPageView = (url: string) => {
  pushToDataLayer({
    event: 'pageview',
    page: url,
  });
};

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  pushToDataLayer({
    event: eventName,
    ...eventParams,
  });
};

export const trackEcommerce = (
  action: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'begin_checkout' | 'purchase',
  data: Record<string, any>
) => {
  pushToDataLayer({
    event: action,
    ecommerce: data,
  });
};

export const trackUser = (userId: string, userData?: Record<string, any>) => {
  pushToDataLayer({
    event: 'user_data',
    userId,
    ...userData,
  });
};
