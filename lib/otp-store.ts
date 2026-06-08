type OtpEntry = { otp: string; expires: number };

declare global {
  // eslint-disable-next-line no-var
  var _myhitchOtpStore: Map<string, OtpEntry> | undefined;
}

if (!global._myhitchOtpStore) {
  global._myhitchOtpStore = new Map();
}

export const otpStore = global._myhitchOtpStore;
