'use strict';
import { Options, PackageInfo } from './types';

export class Filter {
  options = null;

  constructor(options: Options) {
    this.options = options;
    if (this.options.includePackage)
      this.options.includePackage = [...this.options.includePackage].map((x) => x.toLowerCase());
    if (this.options.excludePackage)
      this.options.excludePackage = [...this.options.excludePackage].map((x) => x.toLowerCase());
    if (this.options.onlyLicense)
      this.options.onlyLicense = [...this.options.onlyLicense].map((x) => x.toLowerCase());
    if (this.options.excludeLicense)
      this.options.excludeLicense = [...this.options.excludeLicense].map((x) => x.toLowerCase());
  }

  isFilteredPackage(name: string) {
    if (this.options.includePackage && !this.options.includePackage.includes(name.toLowerCase()))
      return true;
    if (this.options.excludePackage && this.options.excludePackage.includes(name.toLowerCase()))
      return true;
    return false;
  }
  isFilteredLicense(pkg: PackageInfo) {
    if (this.options.onlyLicense && !this.options.onlyLicense.includes(pkg.license.toLowerCase()))
      return true;
    if (
      this.options.excludeLicense &&
      this.options.excludeLicense.includes(pkg.license.toLowerCase())
    )
      return true;
    return false;
  }
}
