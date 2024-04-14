# Generate time-based one time passwords in the browser

![](totp-generator.png)

[Demo](https://totp.danhersam.com/)

This page lets you easily generate a time-based one time password (TOTP) entirely in the web browser in case you ever lose access to your phone.

It uses the excellent [otpauth](https://github.com/hectorm/otpauth) package, downloaded from [raw.githubusercontent.com/hectorm/otpauth/master/dist/otpauth.umd.min.js](https://raw.githubusercontent.com/hectorm/otpauth/master/dist/otpauth.umd.min.js).

## Providing parameters in the URL

You can provide the key, the token digits, period and algorithm in the URL using the URI fragment or query parameters, for examples:

```
https://totp.danhersam.com/#/KEY
https://totp.danhersam.com/#/KEY&digits=6&period=60&algorithm=SHA256
https://totp.danhersam.com/?key=KEY
https://totp.danhersam.com/?digits=6&period=60&algorithm=SHA256&key=KEY
```

The parameters in the URLs, once loaded, are automaticaly removed and not cleared from your browser history (it uses the [history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)).

See [supported hashing algorithms](https://github.com/hectorm/otpauth#supported-hashing-algorithms) for the complete list.

## Sharing key and parameters

A button is available to copy the URL including the non-default parameters.

### Import using QR codes

To make it easier to import Authy entries into another authenticator app, generate QR codes using my [QR code generator](https://dan.hersam.com/tools/gen-qr-code.html).

### Other Resources

* https://www.pommepause.com/2014/10/how-to-extract-your-totp-secrets-from-authy/
* https://github.com/winauth/winauth/issues/545
* https://randomoracle.wordpress.com/2017/02/15/extracting-otp-seeds-from-authy/
* https://gist.github.com/tresni/83b9181588c7393f6853
* https://gist.github.com/Ingramz/14a9c39f8c306a2d43b4
