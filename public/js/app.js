function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

function stripSpaces(str) {
  return str.replace(/\s/g, '');
}

function truncateTo(str, digits) {
  if (str.length <= digits) {
    return str;
  }

  return str.slice(-digits);
}

function parseURLSearch(search) {
  const queryParams = search.split('&').reduce(function (q, query) {
    const chunks = query.split('=');
    const key = chunks[0];
    let value = decodeURIComponent(chunks[1]);
    value = isNaN(Number(value)) ? value : Number(value);
    return (q[key] = value, q);
  }, {});

  return queryParams;
}

const totpDefault = {
  digits: 6,
  period: 30,
  algorithm: 'SHA1'
};

const app = Vue.createApp({
  data() {
    return {
      ...totpDefault,
      secret_key: 'JBSWY3DPEHPK3PXP',
      updatingIn: 30,
      token: null,
      clipboardButton: null,
      url: null,
    };
  },

  mounted: function () {
    this.change()

    this.intervalHandle = setInterval(this.update, 1000);

    this.clipboardButton = new ClipboardJS('.clipboard-button');

    window.addEventListener('hashchange', () => this.change())
  },

  destroyed: function () {
    clearInterval(this.intervalHandle);
  },

  computed: {
    totp: function () {
      return new OTPAuth.TOTP({
        algorithm: this.algorithm,
        digits: this.digits,
        period: this.period,
        secret: OTPAuth.Secret.fromBase32(stripSpaces(this.secret_key)),
      });
    }
  },
  watch: {
    totp: function () {
      this.update(true);
    }
  },
  methods: {
    change: function () {
      this.getFromHash();
      this.getQueryParameters(window.location.search.substr(1));
      this.hideLocationFromHistory();
      this.update(true);
    },
    update: function (force) {
      const mod = (getCurrentSeconds() % this.period);
      this.updatingIn = this.period - mod;
      if (force || 0 === mod) {
        this.token = truncateTo(this.totp.generate(), this.digits);
        this.url = this.getUrl();
      }
    },
    getUrl: function () {
      const url = this.getBaseUrl();
      const data = [this.secret_key]
      Object.keys(totpDefault).forEach(prop => {
        if (this[prop] != totpDefault[prop]) {
            data.push(prop + '=' + encodeURIComponent(this[prop]))
        }
      })
      url.hash = '#' + data.join('&');
      return url.toString();
    },
    getFromHash: function () {
      const params = document.location.hash.replace(/^[#\/]+/, '').split('&');

      if (params[0] && params[0].length > 0) {
        this.secret_key = params[0];
        params.shift();
      }

      if (params.length) {
        this.getQueryParameters(params.join('&'))
      }
    },
    getQueryParameters: function (search) {
      const queryParams = parseURLSearch(search);

      if (queryParams.key) {
        this.secret_key = queryParams.key;
      }

      if (queryParams.digits) {
        this.digits = queryParams.digits;
      }

      if (queryParams.period) {
        this.period = queryParams.period;
      }

      if (queryParams.algorithm) {
        this.algorithm = queryParams.algorithm;
      }
    },
    getBaseUrl: function() {
      const url = new URL(window.location);
      url.hash = '';
      url.search = '';
      return url;
    },
    hideLocationFromHistory: function() {
      history.replaceState({}, '', this.getBaseUrl().toString());
    }
  }
});

app.mount('#app');
