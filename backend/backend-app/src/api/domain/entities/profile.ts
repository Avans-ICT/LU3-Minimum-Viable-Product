export class Profile {
    constructor(
        public firstName: string,
        public lastName: string,
        public interests?: string,
        public studycredits?: number,
        public location?: string,
        public level?: string,
    ) { }
}