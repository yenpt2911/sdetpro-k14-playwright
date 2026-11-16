import { APIRequestContext, APIResponse } from "@playwright/test";

export default class SearchApiClient {

    constructor(private request: APIRequestContext) {}

    public async search(keyword: string): Promise<APIResponse> {
        return await this.request.get(`/search?q=${encodeURIComponent(keyword)}`);
    }
}
