import os from 'os';

class Module {
  protected loaded: boolean;
  protected platforms: string[];
  protected dirname: string;

  constructor(dirname: string) {
    this.loaded = false;
    this.dirname = dirname;
    this.platforms = ['win32', 'linux', 'darwin'];
  }

  // To not be overridden
  async init(): Promise<void> {
    if (this.loaded)
      throw new TypeError(`Module ${this.constructor.name} is already loaded`);

    if (this.platforms.includes(os.platform())) {
      await this.load().catch((err) => {
        throw err;
      });
      this.loaded = true;
    } else {
      console.info(`[INFO] Skipping load of ${this.constructor.name}`);
    }
  }

  // Can (now) be an asynchronous method
  async load(): Promise<void> {
    throw new TypeError(
      `Module ${this.constructor.name} should have a load() method`
    );
    // Do whatever you want here :)
  }
}

export default Module;
