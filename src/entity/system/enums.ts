export enum Status {
  Status_None = 0,
  Status_Signed_Off = 1,
  Status_Pending = 2,
  Status_In_Progress = 3,
  Status_Blocked = 4,
  Status_Error = 5,
  Status_Invalid_Masterdata = 6,
  Status_Ready = 7,
  Status_New_Purchase_Invoice = 8,
  Status_Released = 9,
  Status_Wait_For_Purchase_Order_Match = 10,
  Status_New_Sales_Invoice = 11,
  Status_Imported = 12,
  Status_Import_Error = 13,
  Status_Posted = 14,
  Status_Archived = 15,
  Status_Vrij_1 = 16,
  Status_Vrij_2 = 17,
  Status_Vrij_3 = 18,
  Status_Vrij_4 = 19,
  Status_Vrij_5 = 20,
  Codeer_Vraag = 100,
  Nvt = 101,
  Vraag = 102,
  Null = 9999,
}

export enum Action {
  None = 0,
  ActieVrij1 = 1,
  ActieVrij2 = 2,
  ActieVrij3 = 3,
  ActieVrij4 = 4,
  ActieVrij5 = 5,
  Action_Sign_Off = 6,
  Action_Sign_Off_Ask = 7,
  Action_Await = 8,
  Action_Reply = 9,
  Action_Block = 10,
  Action_Post_Purchase_Invoice = 11,
  Action_Post_Await = 12,
  Action_Post_Block = 13,
  Action_Post_Approve = 14,
  Action_Create_In_Erp = 15,
  Action_Create_In_Logistics_System = 16,
  Action_Check_Masterdata = 17,
  Action_Unblock = 18,
  Action_Unblock_Ask = 19,
  Action_Approve = 20,
  Action_Approve_Await = 21,
  Action_Approve_Block = 22,
  Action_Approve_By = 23,
  Action_Archive_Purchase_Invoice = 24,
  Action_Masterdata_Checked = 25,
  Action_Send_To_Buyer = 26,
  Action_Post_Definitive = 27,
  Action_Import_Purchase_Invoice = 28,
  Action_Import_Error_Purchase_Invoice = 29,
  Action_Send_Back = 30,
  Action_Assign = 31,
  Action_Undo_Last_Action_Purchase_Invoice = 32,
  Action_Release = 33,
  Action_Send = 34,
  Action_Release_Ask = 35,
  Action_Import = 36,
  Action_Post_Sales_Invoice = 37,
  Action_Archive = 38,
  Action_Undo_Last_Action_Sales_Invoice = 39,
  Action_Error = 40,
  BoekingGoedkeuren = 100,
  CodeerVraag = 101,
  GoedkeurVraag = 102,
  Opmerking = 103,
  Null = 9999,
}

export enum FreeAction {
  Vrije_Actie_1 = 1,
  Vrije_Actie_2 = 2,
  Vrije_Actie_3 = 3,
  Vrije_Actie_4 = 4,
  Vrije_Actie_5 = 5,
}
