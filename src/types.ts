export interface NavigationItem {
  id: string;
  label: string;
  scrollRatio: number; // The target scroll ratio (0 to 1) for this item
}

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
}

export interface ExpertiseItem {
  title: string;
  percentage: number;
  description: string;
}
