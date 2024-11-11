export interface RequestBody {
    email: string
}

export interface MessageBody {
    from: string;
    to: string;
    subject: string;
    html: string;
}