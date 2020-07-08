import {ISlide} from './ISlide';

export interface IProject {
  id: Number,
  originalFileName: string,
  uploadedFileName: string,
  filePath: string,
  projectName: string,
  ownerName: string,
  ownerEmail: string,
  projectGuid: string,
  collabCode: string,
  createdAt: string,
  updatedAt: string,
  Slides: ISlide[]
};