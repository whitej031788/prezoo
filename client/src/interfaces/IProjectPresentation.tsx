export interface IProjectPresentation {
  id: Number,
  projectId: Number,
  status: Number,
  presentationGuid: string,
  collabCode: string,
  createdAt: string,
  updatedAt: string,
  enableQuestions: boolean,
  enableReactions: boolean
};