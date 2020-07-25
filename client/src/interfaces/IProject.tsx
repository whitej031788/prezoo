import { ISlide } from './ISlide';

export interface IProject {
  id: Number,
  projectName: string,
  ownerName: string,
  ownerEmail: string,
  createdAt: string,
  updatedAt: string,
  Slides: ISlide[]
};