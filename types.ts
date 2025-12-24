import React from 'react';

export interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
  category: 'social' | 'community' | 'download' | 'official';
  color: string;
}

export interface AppStoreLink {
  platform: string;
  url: string;
  icon: string;
}