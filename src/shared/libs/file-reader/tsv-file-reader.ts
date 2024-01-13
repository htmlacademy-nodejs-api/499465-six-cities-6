import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer, City, HousingType, Conveniency, Coordinate } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public formatNumber(numberStr: string, digits: number): number {
    return Number(Number.parseFloat(numberStr).toFixed(digits));
  }

  public getCoordinates(coordinatesStr: string): Coordinate {
    const coordinates = coordinatesStr.split(';');
    const latitude = coordinates[0].split(': ')[1];
    const longitude = coordinates[1].split(': ')[1];
    return { latitude, longitude };
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, preview, images, isPremium, isFavorite, rating, housingType, roomsQuantity, guestsQuantity, price, conveniencies, author, commentsQuantity, coordinates]) => ({
        title: title.toString(),
        description: description.toString(),
        postDate: new Date(postDate),
        city: city as City,
        preview: preview.toString(),
        images: images.split(';'),
        isPremium: Boolean(+isPremium),
        isFavorite: Boolean(+isFavorite),
        rating: this.formatNumber(rating, 1),
        housingType: housingType as HousingType,
        roomsQuantity: this.formatNumber(roomsQuantity, 0),
        guestsQuantity: this.formatNumber(guestsQuantity, 0),
        price: this.formatNumber(price, 2),
        conveniencies: conveniencies.split(';') as Conveniency[],
        author: author.toString(),
        commentsQuantity: this.formatNumber(commentsQuantity, 0),
        coordinates: this.getCoordinates(coordinates),
      }));
  }
}
