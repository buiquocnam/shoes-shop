// SEO helpers and utilities

import type { Metadata } from 'next';

export const createMetadata = (
  title: string,
  description: string,
  additional?: Partial<Metadata>
): Metadata => ({
  title,
  description,
  ...additional,
});

