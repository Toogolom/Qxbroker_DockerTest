import { BaseModel } from "./base.model";

export interface IVerification
{
    name: string;
	surname: string;
	mobileNumber: string;
	urlForDocumentImage: string;
	walletAddress: string;
	status: VerificationStatus;
}

export enum VerificationStatus {
	Unverified = 'Unverified',
	OnVerification = 'OnVerification',
	Rejected = 'Rejected',
	Verification = 'Verification',
}

export class VerificationModel extends BaseModel {
	name: string = '';
	surname: string = '';
	mobileNumber: string = '';
	urlForDocumentImage: string = '';
	walletAddress: string = '';
	status: VerificationStatus = VerificationStatus.Unverified;

	constructor(data: IVerification) {
		super();
		this.mapFromJson(data);
	}
}
