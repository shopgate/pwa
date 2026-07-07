export interface AppSettingsState {
  settings: {
    appSettings: AppSettings;
  };
}

export interface AppSettings {
  theme: {
    cards: {
      style: 'shadow' | 'border' | 'flat';
      backgroundColor: string;
      padding: number;
    }
  },
  navigation: {
    menubar: {
      style: 'fixed' | 'floating' | 'drawer';
      showLabels: boolean;
      hideOnScroll: boolean;
    }
  }
}
