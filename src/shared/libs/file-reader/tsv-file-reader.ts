import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer, City, HousingType, Conveniency, Coordinate, User, UserType } from '../../types/index.js';

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
      .map(([title, description, postDate, city, preview, images, isPremium, isFavorite, rating, housingType, roomsQuantity, guestsQuantity, price, conveniencies, name, email, avatarImage, password, userType, commentsQuantity, coordinates]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: City[city as keyof typeof City],
        preview,
        images: images.split(';'),
        isPremium: Boolean(+isPremium),
        isFavorite: Boolean(+isFavorite),
        rating: this.formatNumber(rating, 1),
        housingType: HousingType[housingType as keyof typeof HousingType],
        roomsQuantity: this.formatNumber(roomsQuantity, 0),
        guestsQuantity: this.formatNumber(guestsQuantity, 0),
        price: this.formatNumber(price, 2),
        conveniencies: conveniencies.split(';').map((item) => Conveniency[item as keyof typeof Conveniency]),
        author: {
          name,
          email,
          avatarImage,
          password,
          type: UserType[userType as keyof typeof UserType],
        } as User,
        commentsQuantity: this.formatNumber(commentsQuantity, 0),
        coordinates: this.getCoordinates(coordinates),
      }));
  }
}
