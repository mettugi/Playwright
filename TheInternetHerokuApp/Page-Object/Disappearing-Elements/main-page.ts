import { Locator, Page } from '@playwright/test';
import { ABTestPage } from '@pages/ab-test-page';
import { CheckboxesPage } from '@pages/checkboxes-page';
import { ContextMenuPage } from '@pages/context-menu-page';
import { ChallengingDomPage } from '@pages/challenging-dom-page';
import { BrokenImagesPage } from '@pages/broken-images-page';
import { DisappearingElementsPage } from '@pages/disappearing-elements/disappearing-elements-page';
import { DragAndDropPage } from '@pages/drag-and-drop-page';
import { DropdownPage } from '@pages/dropdown-page';
import { DynamicContentPage } from '@pages/dynamic-content-page';
import { EntryAdPage } from '@pages/entry-ad-page';
import { FloatingMenuPage } from '@pages/floating-menu-page';
import { ForgotPasswordPage } from '@pages/reset-password-page';
import { LoginPage } from '@pages/login-page';
import { NestedFrames } from '@pages/nested-frames-page';
import { GeolocationPage } from './geolocation-page';

export class MainPage {
  readonly page: Page;
  readonly header: Locator;
  readonly abTestLink: Locator;
  readonly addRemoveElementsLink: Locator;
  readonly inputsLink: Locator;
  readonly brokenImagesLink: Locator;
  readonly checkboxesLink: Locator;
  readonly contextMenuLink: Locator;
  readonly challengingDomLink: Locator;
  readonly disappearingElementsLink: Locator;
  readonly dragAndDropLink: Locator;
  readonly dropdownLink: Locator;
  readonly dynamicContentLink: Locator;
  readonly entryAdLink: Locator;
  readonly floatingMenuLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly formAuthenticationLink: Locator;
  readonly nestedFramesLink: Locator;
  readonly geolocationLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Welcome to the-internet' });
    this.abTestLink = page.getByRole('link', { name: 'A/B Testing' });
    this.addRemoveElementsLink = page.getByRole('link', { name: 'Add/Remove Elements' });
    this.inputsLink = page.getByRole('link', { name: 'Inputs' });
    this.brokenImagesLink = page.getByRole('link', { name: 'Broken Images' });
    this.checkboxesLink = page.getByRole('link', { name: 'Checkboxes' });
    this.contextMenuLink = page.getByRole('link', { name: 'Context Menu' });
    this.challengingDomLink = page.getByRole('link', { name: 'Challenging DOM' });
    this.disappearingElementsLink = page.getByRole('link', { name: 'Disappearing Elements' });
    this.dragAndDropLink = page.getByRole('link', { name: 'Drag and Drop' });
    this.dropdownLink = page.getByRole('link', { name: 'Dropdown' });
    this.dynamicContentLink = page.getByRole('link', { name: 'Dynamic Content' });
    this.entryAdLink = page.getByRole('link', { name: 'Entry Ad' });
    this.floatingMenuLink = page.getByRole('link', { name: 'Floating Menu' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.formAuthenticationLink = page.getByRole('link', { name: 'Form Authentication' });
    this.nestedFramesLink = page.getByRole('link', { name: 'Nested Frames' });
    this.geolocationLink = page.getByRole('link', { name: 'Geolocation' });
  }

  async abTest(): Promise<ABTestPage> {
    await this.abTestLink.click();
    return new ABTestPage(this.page);
  }

  async checkboxes() {
    await this.checkboxesLink.click();
    return new CheckboxesPage(this.page);
  }

  async contextMenu() {
    await this.contextMenuLink.click();
    return new ContextMenuPage(this.page);
  }

  async brokenImages() {
    await this.brokenImagesLink.click();
    return new BrokenImagesPage(this.page);
  }

  async challengingDom() {
    await this.challengingDomLink.click();
    return new ChallengingDomPage(this.page);
  }

  async dissappearringElements() {
    await this.disappearingElementsLink.click();
    return new DisappearingElementsPage(this.page);
  }

  async dragAndDrop() {
    await this.dragAndDropLink.click();
    return new DragAndDropPage(this.page);
  }

  async dropdown() {
    await this.dropdownLink.click();
    return new DropdownPage(this.page);
  }

  async dynamicContent() {
    await this.dynamicContentLink.click();
    return new DynamicContentPage(this.page);
  }

  async entryAd() {
    await this.entryAdLink.click();
    return new EntryAdPage(this.page);
  }

  async floatingMenu() {
    await this.floatingMenuLink.click();
    return new FloatingMenuPage(this.page);
  }

  async forgotPassword() {
    await this.forgotPasswordLink.click();
    return new ForgotPasswordPage(this.page);
  }

  async formAuthentication() {
    await this.formAuthenticationLink.click();
    return new LoginPage(this.page);
  }

  async nestedFrames() {
    await this.nestedFramesLink.click();
    return new NestedFrames(this.page);
  }

  async geolocation() {
    await this.geolocationLink.click();
    return new GeolocationPage(this.page);
  }
}
