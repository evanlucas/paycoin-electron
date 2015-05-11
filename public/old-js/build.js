(function() {
  function a() {}
  for (var b, c = "assert clear count debug dir dirxml error exception group groupCollapsed groupEnd info log markTimeline profile profileEnd table time timeEnd timeStamp trace warn".split(" "), e = c.length, d = window.console = window.console || {}; e--;) b = c[e], d[b] || (d[b] = a)
})();

var fs = require("fs"),
  assert = require("assert"),
  bitcoin = require("bitcoin"),
  crypto = require("crypto"),
  util = require("util"),
  http = require("http"),
  https = require("https"),
  os = require("os"),
  csv = require("csv-parse"),
  child_process = require("child_process"),
  nwgui = require("nw.gui");


Config = {
  load: function() {
    var a;
    try {
      a = fs.readFileSync(ConfigDir + "html5wallet.conf"), a = JSON.parse(a)
    } catch (b) {
      if ("ENOENT" != b.code) {
        Modal.alert("Error", "Error loading config file: " + b.toString());
        return
      }
      a = {}
    }
    Config.fee = Math.max(a.fee || 0, .001);
    Config.minimizeToTray = a.minimizeToTray || !1;
    Config.minimizeOnClose = a.minimizeOnClose || !1;
    Config.theme = a.theme || "default";
    Config.themeIsInternal = a.themeIsInternal || !0;
    Config.addresses = a.addresses || {
      mine: [],
      others: []
    };
    Config.addresses.mine = Config.addresses.mine || [];
    Config.addresses.others = Config.addresses.others || []
  },
  save: function() {
    var a = {};
    $.each(Config, function(b, e) {
      "save" != b && "load" != b && (a[b] = e)
    });
    try {
      fs.writeFileSync(ConfigDir + "html5wallet.conf", JSON.stringify(a))
    } catch (b) {
      Modal.alert("File System Error", "Error saving config file: " + b.toString())
    }
  }
};



RPC = {
  a: null,
  S: function(a, b, c, e, d, g) {
    function f() {
      0 == Config.addresses.mine.length && RPC.a.getNewAddress(function(a, b) {
        Config.addresses.mine.push({
          label: "Me",
          address: b
        });
        Config.save()
      });
      g()
    }

    function getInfo() {
      console.log("getting info");
      RPC.a.getInfo(function(a, b) {
        "v3.1.0.0-g32a928e" === b.version && f()
      })
    }

    function p() {
      RPC.a.dumpWallet("$test$.dat", function(a) {
        a = !!a;
        RPC.a.h = a;
        RPC.a.c = a;
        RPC.a.g = !a;
        a || fs.unlinkSync("$test$.dat");
        getInfo()
      })
    }

    
    function k(a) {
      console.log("getting balance");
      a ? setTimeout(function() {
        client.getBalance("*", 1, k)
      }, 1E3) : (RPC.a = client, RPC.a.F = !1, p())
    }
    */

    if (d) RPC.a = {
      getBalance: function(a,
        b, c) {
        c(null, 15247.00012)
      },
      sendToAddress: function(a, b, c) {
        c(null, "")
      },
      listTransactions: function(a, b, c) {
        c(null, [{
          address: "iX8ccBLRqCiKGu8V2E33cErE8dmpHxcfBm",
          category: "send",
          amount: -5200,
          fee: -.001,
          confirmations: 3868,
          blockhash: "3d7e4167918a134beef223f64f8225f1208fb385561fedd1de5d2916d62e9236",
          blockindex: 2,
          blocktime: 1409954240,
          txid: "958b84928e2beea264f2d9e5ef43056b25d7f3e13d4c758426912be29e5ac533",
          time: 1409954205,
          timereceived: 1409954205
        }, {
          address: "iX8ccBLRqCiKGu8V2E33cErE8dmpHxcfBm",
          category: "receive",
          amount: 20809.27917865,
          confirmations: 3418,
          blockhash: "db17d787c20a671f4019bfae105e65e4afae03c92fccdd6867b05c7b3c7a5cfb",
          blockindex: 2,
          blocktime: 1409983936,
          txid: "7168aecf62c158a9d060ccd1690b983afd7b9be028e0d612f26f2d6aa59d96e5",
          time: 1409983873,
          timereceived: 1409983873
        }, {
          address: "iX8ccBLRqCiKGu8V2E33cErE8dmpHxcfBm",
          category: "generate",
          amount: 20.27917865,
          confirmations: 3418,
          blockhash: "db17d787c20a671f4019bfae105e65e4afae03c92fccdd6867b05c7b3c7a5cfb",
          blockindex: 2,
          blocktime: 1409983936,
          txid: "7168aecf62c158a9d060ccd1690b983afd7b9be028e0d612f26f2d6aa59d96e5",
          time: 1409983873,
          timereceived: 1409983873
        }])
      },
      getConnectionCount: function(a) {
        a(null, 8)
      },
      getNewAddress: function(a) {
        a(null, "ipnGUVGFn6M4Qfpih6rSLPpDud" + crypto.randomBytes(4).toString("hex"))
      },
      validateAddress: function(a, b) {
        b(null, {
          isvalid: !0,
          ismine: !0
        })
      },
      getBlockCount: function(a) {
        a(null, 91230)
      },
      dumpWallet: function(a, b) {
        b(!0)
      },
      walletLock: function(a) {
        a(null)
      },
      walletPassphrase: function(a, b, c, f) {
        f(null)
      },
      walletPassphraseChange: function(a, b, c) {
        c(null)
      },
      encryptWallet: function(a) {
        a(null)
      },
      getStakingInfo: function(a) {
        a(null, {
          expectedtime: 12900
        })
      },
      getInfo: function(a) {
        a(null, {
          balance: 1265.1009,
          stake: 0,
          version: "v3.0.1.0-g32a928e",
          errors: "This is a just a test. Do not panic."
        })
      },
      setTxFee: function(a, b) {
        b(null, !0)
      },
      listUnspent: function(a) {
        console.log("unspent coin");
        a(null, [])
      },
      h: !0,
      g: !1,
      c: !0
    }, setTimeout(g, 1E3);
    else {
      console.log("such connect");
      
      var client = new bitcoin.Client({
        host: a,
        port: b,
        user: c,
        pass: e,
        timeout: 3E4
      });
      
      client.getBalance("*", 1, k);
      
    }
  }
};


ions = {
  t: function(a, b, c) {
    function e(a) {
      var c = "Could not get data from IONs servers.";
      a && a.message && (c += " " + a.message);
      b && Modal.alert("IONs Error", c)
    }
    http.get(a, function(a) {
      var b = "";
      a.on("data", function(a) {
        b += a
      });
      a.on("end", function() {
        try {
          var a = JSON.parse(b);
          c(a)
        } catch (h) {
          e()
        }
      });
      a.on("error", e)
    }).on("error", e)
  },
  C: function(a) {
    ions.t("http://ions.iocoin.io/api/address-book", !1, function(b) {
      a(b.accounts)
    })
  },
  Y: function(a) {
    var b = [];
    Config.addresses.mine.forEach(function(a) {
      b.push(a.address)
    });
    var b = JSON.stringify(b),
      c = {
        hostname: "ions.iocoin.io",
        path: "/api/my-usernames",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": b.length
        }
      };
    try {
      var e = http.request(c, function(b) {
        b.setEncoding("utf8");
        b.on("data", function(b) {
          try {
            var c = JSON.parse(b);
            a(c["my-accounts"])
          } catch (d) {}
        })
      });
      e.write(b);
      e.end()
    } catch (d) {}
  },
  register: function(a, b) {
    function c(a) {
      Modal.alert("Registration Failed", a)
    }

    function e() {
      ions.t("http://ions.iocoin.io/api/register/" + a + "/" + b, !0, function(d) {
        d.successful ? ions.t("http://ions.iocoin.io/api/status/" +
          a + "-io/" + b, !0,
          function(a) {
            a.error ? c(a.error) : "awaiting-payment" === a.status && RPC.a.sendToAddress(a["payment-address"], parseFloat(a.fee), function(a) {
              a ? "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) : Modal.alert("Request Timeout", "Payment request timed out. Please try again or restart the wallet.") : Modal.alert("Registered Successfully", "Your ION has been registered and will be available once the payment is confirmed.")
            })
          }) : c(d.error)
      })
    }

    function d() {
      RPC.a.getBalance("*",
        1,
        function(a, b) {
          a ? "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) : Modal.alert("Request Timeout", "Check balance request timed out. Please try again or restart the wallet.") : 201 > b ? c("You don't have enough IOC to pay the fee of 200 IOC.") : e()
        })
    }
    RPC.a.c ? Modal.u("Unlock Wallet", "Enter your passphrase to unlock the wallet.", "Passphrase", function(a) {
      RPC.a.walletPassphrase(a, 1, !1, function(a) {
        a ? -14 == a.code ? Modal.n() : "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error",
          a.message) : Modal.alert("Request Timeout", "Unlock request timed out. Please try again or restart the wallet.") : d()
      });
      return !0
    }) : d()
  }
};


function q(a, b) {
  this.b = a;
  this.k = b || null;
  if (b) {
    var c = this;
    b.click(function() {
      r(c)
    })
  }
}

q.prototype.i = function() {};
q.prototype.I = function() {};
q.prototype.refresh = function() {};

var t = null;

function r(a) {
  var b = t;
  assert(a);
  assert(b);
  b.b.addClass("hide");
  b.I();
  b.k && b.k.removeClass("active");
  a.k && a.k.addClass("active");
  a.i();
  a.refresh();
  a.b.removeClass("hide");
  t = a
};

function v() {
  var a = $(".js-loading-panel");
  q.call(this, a);
  t = this
}
v.prototype = Object.create(q.prototype);
new v;


function w() {
  function a(a) {
    var b, c;
    b = [];
    c = new RegExp(a, "i");
    $.each(Config.addresses.others, function(a, d) {
      (c.test(d.label) || c.test(d.address)) && b.push(d)
    });
    h.e && $.each(h.e, function(a, d) {
      (c.test(d.username + "-io") || c.test(d.address)) && b.push({
        label: d.username + "-io",
        address: d.address
      })
    });
    return b
  }

  function b() {
    setTimeout(function() {
      k.find("> :not(.js-suggestion-prototype)").remove()
    }, 100)
  }
  var c = $(".js-tab-balance-content"),
    e = $(".js-tab-balance");
  q.call(this, c, e);
  this.b = c;
  this.j = $(".js-sync");
  this.N = this.j.find(".js-progress");
  this.M = this.j.find(".js-caption");
  var d = c.find(".js-balance-panel"),
    g = c.find(".js-payment-panel"),
    f = g.find("form");
  d.find(".js-payment-panel-toggle").click(function() {
    g.hide().removeClass("hide");
    d.fadeOut(function() {
      g.fadeIn();
      d.addClass("hide").show()
    })
  });
  f.find(".payment-button").click(function() {
    function a() {
      RPC.a.sendToAddress(b, c, function(a) {
        a ? "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) : Modal.alert("Request Timeout", "Payment request timed out. Please try again or restart the wallet.") :
          g.fadeOut(function() {
            d.removeClass("hide").fadeIn()
          })
      })
    }
    var b = f.find(".js-payee")[0].value,
      c = parseFloat(f.find("#js-amount")[0].value);
    if ("" != b && !isNaN(c)) {
      h.e && $.each(h.e, function(a, c) {
        c.username.toLowerCase() + "-io" === b.toLowerCase() && (b = c.address)
      });
      var e = util.format("Send <strong>%d IOC</strong> to <strong><small>%s</small></strong>?", c, b);
      Modal.confirm("Confirm Send", e, function() {
        if (RPC.a.c) return Modal.u("Unlock Wallet", "Enter your passphrase to continue.", "Passphrase", function(b) {
          RPC.a.walletPassphrase(b,
            1, !1,
            function(b) {
              if (b) {
                if (-14 == b.code) return Modal.n(), !1;
                "ETIMEDOUT" != b.code && "ESOCKETTIMEDOUT" != b.code ? Modal.alert("RPC Error", b.message) : Modal.alert("Request Timeout", "Wallet unlock request timed out. Please try again or restart the wallet.");
                return !1
              }
              a()
            });
          return !0
        }), !1;
        a();
        return !0
      })
    }
  });
  f.find("input").focus(function() {
    var a = f.find("label[for='" + this.id + "']").parent();
    a.hasClass("active") || a.addClass("active")
  }).blur(function() {
    var a = f.find("label[for='" + this.id + "']").parent();
    "" == this.value &&
      a.hasClass("active") && a.removeClass("active")
  });
  var h = this;
  h.e = null;
  var p = f.find(".js-payee"),
    k = f.find(".js-suggestions"),
    n = k.find(".js-suggestion-prototype");
  p.blur(function() {
    setTimeout(b, 100)
  }).keyup(function() {
    k.find("> :not(.js-suggestion-prototype)").remove();
    var c = p.val();
    1 > c.length || a(c).forEach(function(a) {
      var c = n.clone();
      k.append(c);
      c.removeClass("js-suggestion-prototype hide");
      c.find(".js-label").text(a.label);
      c.find(".js-address").text(a.address);
      c.click(function() {
        p.val(a.address);
        b()
      })
    })
  });
  e = c.find(".js-alert-button");
  this.v = c.find(".js-alert-container");
  e.click(function() {
    RPC.a.getInfo(function(a, b) {
      var c = b.errors;
      void 0 !== c && "" !== c && Modal.R("Wallet Update Available", c)
    })
  })
}
w.prototype = Object.create(q.prototype);

var aa = new w;

w.prototype.i = function() {
  var a = this.b,
    b = a.find(".js-balance-panel"),
    a = a.find(".js-payment-panel");
  a.hasClass("hide") || (a.addClass("hide"), b.removeClass("hide"));
  var c = this;
  ions.C(function(a) {
    c.e = a
  });
  $(".js-status").removeClass("hide")
};
w.prototype.I = function() {
  $(".js-sync").addClass("hide");
  $(".js-status").addClass("hide")
};
w.prototype.refresh = function() {
  function a() {
    RPC.a.getInfo(function(a, b) {
      if (a) "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code && Modal.alert("RPC Error", a.message);
      else {
        var c = b.stake,
          h = b.balance.toString().split("."),
          p = h[0],
          h = 1 < h.length ? h[1] : null,
          k = p,
          n = p.length,
          s = $(".js-balance"),
          B = $(".js-balance-no-resize"),
          J = $(".js-stake-amount");
        b.errors ? e.v.removeClass("hide") : e.v.addClass("hide");
        h && (k = p + '.<span class="spendable-decimal">' + h + "</span>", n += h.length);
        s.html(k);
        B.html(k);
        J.text(c);
        12 < n && (15 < n ? s.css("font-size",
          "4em") : s.css("font-size", "5em"))
      }
    })
  }

  function b(b) {
    b || (b = "???");
    RPC.a.getStakingInfo(function(c, f) {
      if (c) "ETIMEDOUT" != c.code && "ESOCKETTIMEDOUT" != c.code && Modal.alert("RPC Error", c.message);
      else {
        var h = f.expectedtime,
          h = 0 <= h ? util.format("Staking reward in %s", 60 > h ? (h | 1) + " secs" : 3600 > h ? (h / 60 | 1) + " mins" : 86400 > h ? (h / 60 / 60 | 1) + " hours" : (h / 60 / 60 / 24 | 1) + " days") : RPC.a.g ? "No mature coins to stake" : "Click lock icon to enable staking",
          h = util.format("Last block: %s - %s", b, h);
        $(".js-status").text(h);
        a()
      }
    })
  }

  function c(a,
    c) {
    if (t == e) {
      if (c && 0 >= c - a) e.j.addClass("hide");
      else {
        var f, h;
        c ? (f = a / c * 100 | 0, h = util.format("Syncing wallet (%d / %d blocks)", a, c)) : (f = 0, h = util.format("Syncing wallet (%d / ??? blocks)", a));
        e.j.removeClass("hide");
        e.N.attr("aria-valuenow", f);
        e.N.css("width", f);
        e.M.text(h)
      }
      b(c)
    }
  }
  var e = this;
  (function() {
    RPC.a.getBlockCount(function(a, b) {
      if (a) "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code && Modal.alert("RPC Error", a.message);
      else https.get("https://chainz.cryptoid.info/explorer/index.data.dws?coin=xpy", function(a) {
        var h = "";
        a.on("data",
          function(a) {
            h += a
          });
        a.on("end", function() {
          try {
            var a = JSON.parse(h).blocks[0].height;
            c(b, a)
          } catch (d) {
            c(b)
          }
        });
        a.on("error", function() {
          c(b)
        })
      }).on("error", function() {
        c(b)
      })
    })
  })()
};

function x() {
  var content = $(".js-tab-transaction-content"),
    tab = $(".js-tab-transaction");
  q.call(this, content, tab);
  this.tab = content;
  this.s = content.find(".js-show-sent-button");
  this.r = content.find(".js-show-received-button");
  this.q = content.find(".js-show-all-button");
  this.s.click(this.m.bind(this, "sent"));
  this.r.click(this.m.bind(this, "received"));
  this.q.click(this.m.bind(this, "all"))
}

x.prototype = Object.create(q.prototype);
x.prototype.m = function(a) {
  a && (this.H = a);
  var content = $(".js-tab-transaction-content");
  a = content.find(".sent");
  b = content.find(".received");
  a.removeClass("hide");
  content.removeClass("hide");
  this.r.removeClass("active");
  this.s.removeClass("active");
  this.q.removeClass("active");
  "sent" == this.H ? (content.addClass("hide"), this.s.addClass("active")) : "received" == this.H ? (a.addClass("hide"), this.r.addClass("active")) : this.q.addClass("active")
};

x.prototype.refresh = function() {
  var a = this;
  RPC.a.listTransactions("*", 100, function(b, c) {
    if (b) "ETIMEDOUT" != b.code && "ESOCKETTIMEDOUT" != b.code && Modal.alert("RPC Error", b.message);
    else {
      var e = a.b.find(".js-transactions"),
        d = e.find(".js-transaction-prototype");
      e.find("> :not(.js-transaction-prototype)").remove();
      var g = a.b.find(".js-not-empty"),
        f = a.b.find(".js-empty");
      0 == c.length ? (g.addClass("hide"), f.removeClass("hide")) : (g.removeClass("hide"), f.addClass("hide"), c.forEach(function(a) {
        var b = a.confirmations,
          c = a.address,
          f = a.amount,
          g = a.category,
          B = "send" == g ? "sent" : "received",
          J = a.txid,
          Y = (new Date(1E3 * a.time)).toISOString().replace("T", " ").substr(0, 19),
          u = Config.addresses.mine.filter(function(a) {
            return a.address === c
          })[0];
        u || (u = Config.addresses.others.filter(function(a) {
          return a.address === c
        })[0]);
        u = u ? u.label : c;
        "sent" == B && (f += a.fee);
        a = d.clone();

        var amount = a.find(".js-amount"),
          address = a.find(".js-address"),
          date = a.find(".js-date"),
          confirms = a.find(".js-confirmations"),
          id = a.find(".js-transaction-id");
        a.removeClass("js-transaction-prototype hide").addClass(B);

        amount.text(f);
        address.text(u);
        date.text(Y + " UTC");
        confirms.text(b);
        id.text(J);
        "generate" != g && "immature" != g || address.html('<i class="icon-pickaxe"></i> ' + address.html());
        e.prepend(a)
      }), a.m())
    }
  })
};
new x;

function y() {
  function a() {
    e.fadeOut(70, function() {
      g.removeClass("active");
      h.p = "";
      z(h);
      f.val("");
      d.fadeIn(70)
    })
  }
  var b = $(".js-tab-address-book-content"),
    c = $(".js-tab-address-book");
  q.call(this, b, c);
  this.b = b;
  this.p = "";
  this.e = [];
  var e = b.find(".js-address-search"),
    d = b.find(".js-address-intro"),
    g = b.find(".js-search-button"),
    b = b.find(".js-add-address"),
    f = e.find("input"),
    h = this;
  f.blur(a).keyup(function() {
    h.p = f.val().toLowerCase();
    z(h)
  });
  g.click(function() {
    g.hasClass("active") ? a() : (g.addClass("active"), d.fadeOut(70,
      function() {
        e.fadeIn(70).find("input").focus()
      }))
  });
  b.click(function() {
    Modal.prompt("Add Address", "Leave the address empty to generate a new receiving address.", "Label", "Address", function(a, b) {
      if ("" == a) return !1;
      b ? RPC.a.validateAddress(b, function(c, f) {
        c ? "ETIMEDOUT" != c.code && "ESOCKETTIMEDOUT" != c.code ? Modal.alert("RPC Error", c.message) : Modal.alert("Request Timeout", "Address validation request timed out. Please try again or restart the wallet.") : f.isvalid ? (Config.addresses.others.push({
            label: a,
            address: b
          }),
          Config.save(), z(h)) : Modal.alert("Invalid Address", "That address was not valid.")
      }) : RPC.a.getNewAddress(function(b, c) {
        b ? "ETIMEDOUT" != b.code && "ESOCKETTIMEDOUT" != b.code ? Modal.alert("RPC Error", b.message) : Modal.alert("Request Timeout", "New address request timed out. Please try again or restart the wallet.") : (Config.addresses.mine.push({
          label: a,
          address: c
        }), Config.save(), z(h))
      });
      return !0
    })
  })
}
y.prototype = Object.create(q.prototype);
var A = new y;
y.prototype.i = function() {
  var a = this;
  ions.C(function(b) {
    var c = [];
    b.forEach(function(a) {
      c.push(a.address)
    });
    a.e = c;
    z(A)
  })
};

function C(a, b) {
  var c = b ? "mine" : "others",
    e = Config.addresses[c];
  Modal.confirm("Delete Address", "Are you sure you want to delete this address?", function() {
    Config.addresses[c] = e.filter(function(b) {
      return b.address != a
    });
    Config.save();
    z(A);
    return !0
  })
}

function D(a, b) {
  var c = b ? Config.addresses.mine : Config.addresses.others;
  Modal.prompt("Rename Address", "Enter a new name for this address.", "Name", function(b) {
    if ("" == b) return !1;
    c.forEach(function(c) {
      c.address == a && (c.label = b)
    });
    Config.save();
    z(A);
    return !0
  })
}

function z(a) {
  var b = a.b,
    c = b.find(".js-address-prototype"),
    e = b.find(".js-my-addresses"),
    d = b.find(".js-empty"),
    g = b.find(".js-not-empty");
  e.text("");
  0 == Config.addresses.others.length && 0 == Config.addresses.mine.length ? (d.removeClass("hide"), g.addClass("hide")) : (d.addClass("hide"), g.removeClass("hide"), RPC.a.listUnspent(function(b, d) {
    if (b) "ETIMEDOUT" != b.code && "ESOCKETTIMEDOUT" != b.code && Modal.alert("RPC Error", b.message);
    else {
      var g = {};
      d.forEach(function(a) {
        var b = a.address;
        g[b] = (g[b] || 0) + a.amount;
        var c = !0;
        Config.addresses.mine.forEach(function(a) {
          a.address === b && (c = !1)
        });
        c && (Config.addresses.mine.push({
          label: "",
          address: b
        }), Config.save())
      });
      var k = {};
      Config.addresses.mine.forEach(function(b) {
        var f = b.label;
        b = b.address;
        if (-1 != f.toLowerCase().indexOf(a.p)) {
          var d = c.clone().removeClass("js-address-prototype hide");
          d.find(".js-address-name").text(f);
          d.find(".js-address").text(b);
          d.find(".js-edit").click(D.bind(null, b, !0));
          d.find(".js-delete").click(C.bind(null, b, !0));
          k[b] = d.find(".js-balance-container").removeClass("hide").find(".js-address-balance");
          e.append(d)
        }
      });
      Object.keys(g).forEach(function(a) {
        var b = (g[a] || 0).toFixed(8).split("."),
          c = b[0],
          b = 1 < b.length ? b[1] : null,
          d = c + "";
        b && "00000000" != b && (d = c + '.<span class="spendable-decimal">' + b + "</span>");
        k[a] && k[a].html(d)
      })
    }
  }), e = b.find(".js-other-addresses"), e.text(""), Config.addresses.others.forEach(function(b) {
    var d = b.label;
    b = b.address;
    if (-1 != d.toLowerCase().indexOf(a.p)) {
      var g = c.clone().removeClass("js-address-prototype hide");
      g.find(".js-address-name").text(d);
      g.find(".js-address").text(b);
      g.find(".js-edit").click(D.bind(null,
        b, !1));
      g.find(".js-delete").click(C.bind(null, b, !1));
      e.append(g)
    }
  }))
};


function E() {
  var a = $(".js-settings-panel"),
    b = $(".js-tab-settings");
  this.b = a;
  q.call(this, a, b);
  var c = a.find('input[name="fee"]'),
    b = a.find('input[name="minimizeToTray"]'),
    e = a.find('input[name="minimizeOnClose"]'),
    d = os.platform();
  "win32" != d && "win64" != d && a.find(".js-minimize-to-tray-label").remove();
  c.change(function() {
    Config.fee = c.val();
    Config.save()
  });
  b.change(function() {
    Config.minimizeToTray = this.checked;
    Config.save()
  });
  e.change(function() {
    Config.minimizeOnClose = this.checked;
    Config.save()
  });
  c.val(Config.fee);
  b[0].checked = Config.minimizeToTray;
  e[0].checked = Config.minimizeOnClose;
  var d = a.find(".js-themes"),
    g = d.find(".js-theme-prototype");
  g.addClass("hide");
  var f = a.find(".js-export"),
    h = a.find(".js-import"),
    p = a.find(".js-show-data");
  f.click(function() {
    Modal.W("Export Wallet", "Choose where you would like to save the data.", "File", function(a) {
      RPC.a.backupWallet(a, function(a) {
        a && ("ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) : Modal.alert("Request Timeout", "Dump request timed out. Please try again or restart the wallet."))
      });
      return !0
    })
  });
  h.click(function() {
    Modal.X("Import Addresses", "Select the CSV file exported by the Qt wallet.", "File", function(a) {
      fs.readFile(a, function(a, b) {
        a ? Modal.alert("File Error", a.message) : csv(b, {}, function(a, b) {
          a ? Modal.alert("CSV Error", a.message) : (b.forEach(function(a) {
            var b = a[0],
              c = a[1];
            "" === b && (b = "(No Label)");
            RPC.a.validateAddress(c, function(a, d) {
              if (!a && d.isvalid) {
                var f = d.ismine ? Config.addresses.mine : Config.addresses.others;
                0 < f.filter(function(a) {
                  return a.address == c
                }).length || f.push({
                  label: b,
                  address: c
                })
              }
            })
          }), Config.save())
        })
      });
      return !0
    })
  });
  p.click(function() {
    require("nw.gui").Shell.showItemInFolder(ConfigDir)
  });
  var f = a.find(".js-change-password"),
    k = a.find(".js-new-password"),
    n = a.find(".js-old-password"),
    s = a.find(".js-confirm-password");
  f.click(function() {
    function a(b) {
      Modal.alert("Invalid Password", b)
    }
    var b = k.val(),
      c = n.val(),
      d = s.val();
    RPC.a.h ? "" === b ? a("New password cannot be empty. To decrypt wallet, use export function in Settings tab.") : c === b ? a("New password cannot be the same as current password.") :
      b !== d ? a("New passwords do not match.") : RPC.a.walletPassphraseChange(c, b, function(a) {
        a ? -14 == a.code ? Modal.n() : "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) : Modal.alert("Request Timeout", "Passphrase change request timed out. Please try again or restart the wallet.") : (Modal.alert("Success", "Password changed successfully."), k.val(""), n.val(""), s.val(""))
      }) : "" === b ? a("New password cannot be empty") : b !== d ? a("New passwords do not match.") : RPC.a.encryptWallet(b, function(a) {
        a ?
          "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) : Modal.alert("Request Timeout", "Encryption request timed out. Please try again or restart the wallet.") : (RPC.a.h = !0, RPC.a.c = !0, F.removeClass("icon-unlock-2").addClass("icon-lock"), G.text("Encryption On"), RPC.a.F = !0, Modal.alert("Exiting", "The wallet will exit to finish encrypting. Please restart it afterward."))
      })
  });
  this.w = d;
  this.O = g;
  this.J = c;
  this.L = b;
  this.K = e
}
E.prototype = Object.create(q.prototype);
new E;
E.prototype.i = function() {
  this.J.val(Config.fee);
  this.L[0].checked = Config.minimizeToTray;
  this.K[0].checked = Config.minimizeOnClose;
  RPC.a.h || this.b.find(".js-old-password").addClass("hide");
  var a = this;
  this.w.find("> :not(.js-theme.prototype)").remove();
  //Theme.U();
  /*
  Theme.f.forEach(function(b) {
    var c = a.O.clone();
    c.removeClass("js-theme-prototype");
    c.find(".js-theme-name").text(b.name);
    c.find(".js-theme-img").attr("src", b.D);
    c.click(function() {
      b.apply();
      Config.theme = b.name;
      Config.themeIsInternal = b.o;
      Config.save()
    });
    a.w.append(c);
    c.removeClass("hide")
  });
*/
  RPC.a.getInfo(function(b, c) {
    if (!b) {
      var e = a.b.find(".js-daemon-version"),
        d = c.version,
        g = d.indexOf("-"),
        d = -1 != g ? d.substring(1, g) : d.substring(1);
      e.text(d)
    }
  })
};

function H() {
  var a = $(".js-ions-panel"),
    b = $(".js-tab-ions");
  q.call(this, a, b);
  this.b = a;
  var c = a.find(".js-address-selector"),
    e = a.find(".js-address-selections");
  $(document).click(function() {
    e.addClass("hide")
  });
  c.click(function(a) {
    e.removeClass("hide");
    a.stopPropagation()
  });
  var d = a.find(".js-register-ion-button"),
    g = a.find(".js-ion-name"),
    f = this;
  H.prototype.G = function(a) {
    a && d.hasClass("hide") ? d.removeClass("hide") : a || d.hasClass("hide") || d.addClass("hide")
  };
  d.click(function() {
    var a = g.val(),
      b = c.text();
    "" !==
    b && "" !== a && Modal.confirm("Register ION", "Are you sure you want to register this ION for 200 IOC?", function() {
      ions.register(a, b);
      z(f)
    })
  });
  var h = a.find(".js-ion-name-label");
  g.focus(function() {
    h.addClass("active")
  }).blur(function() {
    "" === g.val() && h.removeClass("active")
  }).keyup(function() {
    f.G(!!$(this).val())
  })
}
H.prototype = Object.create(q.prototype);
new H;
H.prototype.i = function() {
  var a = this.b.find(".js-address-selector"),
    b = this.b.find(".js-address-selections"),
    c = this.b.find(".js-ion-name"),
    e = this.b.find(".js-ion-name-label");
  c.hasClass("hide") || (c.addClass("hide"), e.addClass("hide"));
  this.G(!1);
  b.html("");
  c.val("");
  var d = "Create an address in the Address Book first";
  0 < Config.addresses.mine.length && (d = "Select an address");
  a.html(d + ' <i class="icon-caret-down-two"></i>');
  Config.addresses.mine.forEach(function(a) {
    b.append("<li><a>" + a.address + "</a></li>")
  });
  b.find("a").click(function() {
    a.html($(this).text() + ' <i class="icon-caret-down-two"></i>');
    c.removeClass("hide");
    e.removeClass("hide")
  })
};
H.prototype.refresh = function() {
  var a = this.b.find(".js-ions-table"),
    b = this.b.find(".js-ion-prototype");
  ions.Y(function(c) {
    a.html("");
    c.forEach(function(c) {
      var d = b.clone().removeClass("hide");
      d.find(".js-ion-name").text(c.username);
      d.find(".js-ion-address").text(c.address);
      var g = d.find(".js-ion-status"),
        f = g.find("i");
      g.find("span").text(c.status);
      "Confirmed" == accountStatus ? (g.addClass("ions-active"), f.attr("class", "icon-check-mark")) : "Awaiting confirmation" === accountStatus ? (g.addClass("ions-inactive"),
        f.attr("class", "icon-circle-line")) : (g.addClass("ions-inactive"), f.attr("class", "icon-exclamation"));
      a.append(d)
    })
  })
};
var I = $(".modal-popup"),
  L = $(".modal-popup-bg"),
  M = $(".app"),
  fa = {
    plain: function(a) {
      return util.format('<input type="text" name="%s" placeholder="%s" />', a, a)
    },
    password: function(a) {
      return util.format('<input type="password" name="%s" placeholder="%s" />', a, a)
    },
    file: function(a) {
      return util.format('<input type="file" name="%s" />', a)
    },
    "export": function(a) {
      return util.format('<input type="file" name="%s" nwsaveas="wallet.dat" />', a)
    }
  };

function N(a) {
  return util.format('<div class="buttons">%s</div>', a)
}
Modal = {
  l: function() {
    M.addClass("blurred");
    L.removeClass("hide");
    I.removeClass("hide").removeClass("zoomOut").addClass("zoomIn");
    I.fadeIn(300)
  },
  d: function() {
    I.removeClass("zoomIn").addClass("zoomOut");
    setTimeout(function() {
      M.removeClass("blurred");
      L.addClass("hide");
      I.addClass("hide")
    }, 200)
  },
  alert: function(a, b) {
    I.html('<span class="modal-title">' + a + "</span>" + ("<p>" + b + "</p>") + N('<a class="button button-single"><i class="icon-check-mark"></i></a>'));
    I.find(".button-single").click(Modal.d);
    Modal.l()
  },
  R: function(a, b) {
    b = b.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    Modal.alert(a, b)
  },
  n: function() {
    Modal.alert("Bad Passphrase", "That passphrase is incorrect. Please try again.")
  },
  confirm: function(a, b, c) {
    I.html('<span class="modal-title">' + a + "</span>" + ("<p>" + b + "</p>") + N('<a href="#" class="button button-ok"><i class="icon-check-mark"></i></a><a href="#" class="button button-cancel"><i class="icon-remove"></i></a>'));
    I.find(".button-cancel").click(Modal.d);
    I.find(".button-ok").click(function() {
      c ?
        c() && Modal.d() : Modal.d()
    });
    Modal.l()
  }
};

function O(a) {
  return function(b, c) {
    function e() {
      if (h) {
        var a = [];
        g.forEach(function(b) {
          b = I.find('input[name="' + b + '"]').val();
          a.push(b)
        });
        h.apply(null, a) && Modal.d()
      }
    }
    b = '<span class="modal-title">' + b + "</span>";
    c = "<p>" + c + "</p>";
    for (var d = "", g = [], f = 2; f < arguments.length - 1; f++) d += fa[a](arguments[f]), g.push(arguments[f]);
    I.html(b + c + d + N('<a href="#" class="button button-ok"><i class="icon-check-mark"></i></a><a href="#" class="button button-cancel"><i class="icon-remove"></i></a>'));
    var h = arguments[arguments.length -
        1],
      d = I.find("input");
    I.find(".button-cancel").click(Modal.d);
    I.find(".button-ok").click(e);
    d.keypress(function(a) {
      13 === a.which && e()
    });
    Modal.l();
    d.first().focus()
  }
}
Modal.prompt = O("plain");
Modal.u = O("password");
Modal.X = O("file");
Modal.W = O("export");
Modal.V = function() {
  function a(a, b, c) {
    function d() {
      a.find(".js-exchange-rate").text("Error")
    }
    require("https").get(b, function(b) {
      var f = "";
      b.on("data", function(a) {
        f += a
      });
      b.on("end", function() {
        try {
          var b = JSON.parse(f);
          b.success ? (f = c(b)) ? (b = f, "none" !== b.change && a.addClass(b.up ? "up" : "down").find(".js-up-or-down-today").addClass(b.up ? "icon-angle-up" : "icon-angle-down"), a.find(".js-exchange-rate").text(b.amount.toFixed(8))) : d() : d()
        } catch (e) {
          d()
        }
      });
      b.on("error", d)
    }).on("error", d)
  }
  var b = $(".js-exchange-data-prototype").clone().removeClass("js-exchange-data-prototype hide"),
    c = b.find(".js-bittrex .js-exchange-rate-container"),
    e = b.find(".js-cryptsy .js-exchange-rate-container"),
    d = b.find(".js-ask-coin .js-exchange-rate-container");
  (function(b) {
    b.find(".js-buy").click(function() {
      require("nw.gui").Shell.openExternal("https://bittrex.com/Market/Index?MarketName=BTC-IOC")
    });
    a(b, "https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-ioc", function(a) {
      a = a.result[0];
      var b = a.Last;
      a = a.PrevDay;
      return {
        amount: b,
        change: b > a && 0 < a ? "up" : b < a ? "down" : "none"
      }
    })
  })(c);
  (function(b) {
    b.find(".js-buy").click(function() {
      require("nw.gui").Shell.openExternal("https://www.cryptsy.com/markets/view/IOC_BTC")
    });
    a(b, "https://www.cryptsy.com/api/v2/markets/272", function(a) {
      a = a.data;
      return {
        amount: a.last_trade.price,
        change: "none"
      }
    })
  })(e);
  (function(b) {
    b.find(".js-buy").click(function() {
      require("nw.gui").Shell.openExternal("https://askcoin.net/trading/IOC/BTC")
    });
    a(b, "https://askcoin.net/api/v1/market/stats/IOC/BTC", function(a) {
      a = a.result;
      var b = a.change;
      return {
        amount: 1 * a.price,
        change: 0 < b ? "up" : 0 > b ? "down" : "none"
      }
    })
  })(d);
  I.html("").append(b).append(N('<a class="button button-single"><i class="icon-check-mark"></i></a>'));
  I.find(".button-single").click(Modal.d);
  Modal.l()
};


Window = nwgui.Window.get();
var Q, R = os.platform();
"win32" == R || "win64" == R ? Q = process.env.APPDATA + "\\iocoin\\" : "darwin" == R ? Q = process.env.HOME + "/Library/Application Support/iocoin/" : "linux" == R ? Q = process.env.HOME + "/.iocoin/" : (alert("Fatal error: Unknown platform: " + R), process.exit(1));
ConfigDir = Q;
process.on("uncaughtException", function(a) {
  alert("Fatal error: " + a.stack);
  process.exit(1)
});

function ga(a, b, c) {
  a = fs.openSync(a, "a");
  fs.writeSync(a, "\n");
  fs.writeSync(a, "rpcuser=" + b + "\n");
  fs.writeSync(a, "rpcpassword=" + c);
  fs.closeSync(a)
}

function readConfig() {
  var a, b, c, e = ConfigDir + "iocoin.conf";
  (a = fs.existsSync(e)) || fs.existsSync(ConfigDir) || fs.mkdirSync(ConfigDir);
  if (a) {
    var d = {},
      g = /(.+)=(.+)/;
    fs.readFileSync(e).toString("ascii").replace("\r", "").split("\n").map(function(a) {
      a = g.exec(a);
      var b = null,
        c = null;
      a && (b = a[1], c = a[2]);
      b && c && (d[b] = c)
    });
    if (d.rpcuser && d.rpcpassword) return a = d.rpcuser, b = d.rpcpassword, c = d.rpcport || 33765, [a, b, c]
  }
  a = "iocoinrpc";
  b = crypto.randomBytes(16).toString("hex");
  c = 33765;
  ga(e, a, b);
  return [a, b, c]
}

function rpcInfo() {
  RPC.a.g && !T.hasClass("lit") ? (T.addClass("lit"), U.text("Staking")) : !RPC.a.g && T.hasClass("lit") && (T.removeClass("lit"), U.text("Not Staking"));
  RPC.a.c && F.hasClass("icon-unlock-2") ? (F.removeClass("icon-unlock-2").addClass("icon-lock"), G.text("Wallet Locked")) : !RPC.a.c && F.hasClass("icon-lock") && (F.removeClass("icon-lock").addClass("icon-unlock-2"), RPC.a.h ? G.text("Wallet Unlocked") : G.text("Wallet Unencrypted"));
  t && t.refresh();
  (function() {
    RPC.a.getConnectionCount(function(a, b) {
      if (a) "ETIMEDOUT" !=
        a.code && "ESOCKETTIMEDOUT" != a.code && Modal.alert("RPC Error", a.message);
      else {
        var c;
        c = 1 == b ? "1 connection" : b + " connections";
        $(".js-connection-count").text(c);
        c = $(".js-signal");
        0 == b && c.hasClass("lit") ? c.removeClass("lit") : 0 < b && !c.hasClass("lit") && c.addClass("lit")
      }
    })
  })()
}
var V = $(".js-lock"),
  T = $(".js-stake"),
  G = V.find(".tooltip"),
  F = V.find("i"),
  U = T.find(".tooltip");

function ia() {
  RPC.a.h ? RPC.a.g ? RPC.a.walletLock(function(a) {
    a ? "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) : Modal.alert("Request Timeout", "Lock request timed out. Please try again or restart the wallet.") : (RPC.a.g = !1, RPC.a.c = !0)
  }) : Modal.u("Unlock Wallet", "Enter your passphrase to unlock the wallet.", "Passphrase", function(a) {
    RPC.a.walletPassphrase(a, 1E9, !1, function(a) {
      a ? -14 == a.code ? Modal.n() : "ETIMEDOUT" != a.code && "ESOCKETTIMEDOUT" != a.code ? Modal.alert("RPC Error", a.message) :
        Modal.alert("Request Timeout", "Unlock request timed out. Please try again or restart the wallet.") : (RPC.a.g = !0, RPC.a.c = !1)
    });
    return !0
  }) : Modal.alert("No Password", "Set a password in the Settings tab to enable locking.")
}

function ja() {
  var a = new nwgui.Menu;
  a.append(new nwgui.MenuItem({
    label: "Cut",
    click: function() {
      document.execCommand("cut")
    }
  }));
  a.append(new nwgui.MenuItem({
    label: "Copy",
    click: function() {
      document.execCommand("copy")
    }
  }));
  a.append(new nwgui.MenuItem({
    label: "Paste",
    click: function() {
      document.execCommand("paste")
    }
  }));
  $(document).on("contextmenu", function(b) {
    b.preventDefault();
    a.popup(b.originalEvent.x, b.originalEvent.y)
  });
  RPC.a.setTxFee(Config.fee, function() {});


  r(aa);


  $(".js-tab-panel").removeClass("hide");
  $(".js-signal").removeClass("hide");

  V.removeClass("hide");
  T.removeClass("hide");
  DEBUG && $(".js-button-refresh").removeClass("hide").click(function() {
    location.reload()
  });
  V.click(ia);
  $(".js-exchange-button").removeClass("hide").click(Modal.V);
  rpcInfo();
  setInterval(rpcInfo, 4E3)
}

// This Variable Houses the Process
var daemonProcess = null;

function runDaemon() {
  var a = os.platform();
  //W = child_process.spawn("win32" == a || "win64" == a ? process.env["PROGRAMFILES(X86)"] ? process.env["PROGRAMFILES(X86)"] + "\\IOCoin HTML5 Wallet\\iocoind.exe" : process.env.PROGRAMFILES + "\\IOCoin HTML5 Wallet\\iocoind.exe" : "/usr/local/bin/iocoind", ["-server", "-min", "-splash=0"]);
  daemonProcess = child_process.spawn("win32" == a || "win64" == a ? process.env["PROGRAMFILES(X86)"] ? process.env["PROGRAMFILES(X86)"] + "\\IOCoin HTML5 Wallet\\iocoind.exe" : process.env.PROGRAMFILES + "\\PayCoin HTML5 Wallet\\iocoind.exe" : "/usr/local/bin/iocoind", ["-server", "-min", "-splash=0"]);
  daemonProcess.on("exit", function() {
    0 == daemonProcess.exitCode ? alert("Daemon has exited, exiting wallet.") : RPC.a.F || alert("Daemon encountered an error. If iocoind is already running, wait for it to exit or kill it and try starting the wallet again.");
    process.exit(0)
  });

  console.log('Daemon Started')
  daemonProcess.on("error", function(a) {
    alert("ENOENT" == a.code ? "Wallet daemon could not be found. Please re-install HTML5 wallet." : "Daemon error: " + a.message);
    process.exit(1)
  })
}
process.on("exit", function() {
  daemonProcess && daemonProcess.kill()
});

var X;
Window.on("minimize", function() {
  var a = os.platform();
  !Config.minimizeToTray || "win32" != a && "win64" != a || (this.hide(), X = new nwgui.Tray({
    icon: "img/logo_small.png",
    title: "PayCoin Wallet"
  }), X.tooltip = "PayCoin Wallet", X.on("click", function() {
    Window.show();
    this.remove()
  }))
});

DEBUG && Window.showDevTools();


(function() {
  Config.load();

  Window.title = "PayCoin Wallet v1.0.0";
  $("#js-title").text("PayCoin Wallet v1.0.0");
  if ("darwin" == os.platform()) {
    var a = new nwgui.Menu({
      type: "menubar"
    });
    a.createMacBuiltin("PayCoin");
    Window.menu = a
  }
  $(".js-button-close").click(function() {
    Config.minimizeOnClose ? Window.minimize() : process.exit(0)
  });
  $(".js-button-minimize").click(function() {
    Window.minimize()
  });

  var config = readConfig(),
    user = config[0],
    pass = config[1],
    port = config[2];
    console.log(user,pass,port);
  user && pass || (alert("RPC username or password could not be read from iocoin.conf."),
    process.exit(1));

  DEBUG || runDaemon();

  RPC.S("localhost", port, user, pass, DEBUG, ja)
})();
