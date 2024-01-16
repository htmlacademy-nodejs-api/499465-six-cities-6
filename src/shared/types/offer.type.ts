import { City } from './city-type.enum.js';
import { HousingType } from './housing-type.enum.js';
import { Conveniency } from './conveniency-type.enum.js';
import { User } from './user.type.js';
import { Coordinate } from './coordinate.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  preview: string,
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsQuantity: number;
  guestsQuantity: number;
  price: number;
  conveniencies: Conveniency[];
  author: User;
  commentsQuantity: number,
  coordinates: Coordinate;
}
