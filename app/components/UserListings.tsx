import React, { useEffect, useState } from 'react';
import { ListingCard } from './ListingCard';
import { fetchListingByUser } from '~/service/fetch-listings';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | string;
  image?: string;
  displayName?: string;
  uid: string;
  views: number;
}

