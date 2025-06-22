import { Page } from '@playwright/test';

export class NestedFrames {
  private readonly page: Page;
  readonly frameTop;
  readonly frameLeft;
  readonly frameMiddle;
  readonly frameRight;
  readonly frameBottom;

  constructor(page: Page) {
    this.page = page;
    this.frameTop = page.frameLocator('frame[name="frame-top"]');
    this.frameLeft = this.frameTop.frameLocator('frame[name="frame-left"]');
    this.frameMiddle = this.frameTop.frameLocator('frame[name="frame-middle"]');
    this.frameRight = this.frameTop.frameLocator('frame[name="frame-right"]');
    this.frameBottom = page.frameLocator('frame[name="frame-bottom"]');
  }
}
