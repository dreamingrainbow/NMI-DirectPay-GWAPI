const querystring = require("querystring");

function number_format(number, decimals, decPoint, thousandsSep) {
  number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
  var n = !isFinite(+number) ? 0 : +number;
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  var sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
  var dec = typeof decPoint === "undefined" ? "." : decPoint;
  var s = "";

  var toFixedFix = function (n, prec) {
    if (("" + n).indexOf("e") === -1) {
      return +(Math.round(n + "e+" + prec) + "e-" + prec);
    } else {
      var arr = ("" + n).split("e");
      var sig = "";
      if (+arr[1] + prec > 0) {
        sig = "+";
      }
      return (+(
        Math.round(+arr[0] + "e" + sig + (+arr[1] + prec)) +
        "e-" +
        prec
      )).toFixed(prec);
    }
  };

  // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec).toString() : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }

  return s.join(dec);
}

class gwapi {
  constructor(cb) {
    this.login = {};
    this.order = {};
    this.billing = {};
    this.shipping = {};
    this.paymentMethod = {};
    this.items = [];
    this.products = [];
    this.plans = [];
    this.subscriptions = [];
    this.test = false;
    this.cb = cb.bind(this);
  }
  // Initial Setting Functions

  static testPaymentDetails = {
    visa: "4111111111111111",
    mastercard: "5431111111111111",
    discover: "6011601160116611",
    amex: "341111111111111",
    diners: "30205252489926",
    jcb: "3541963594572595",
    maestro: "6799990100000000019",
    ccexp: "10/25",
    checkaba: "123123123",
    checkaccount: "123123123",
  };

  /**
   * Enable test mode for this transaction.
   * Triggering Errors in Test Mode
   * To cause a declined message, pass an amount less than 1.00.
   * To trigger a fatal error message, pass an invalid card number.
   * To simulate an AVS match, pass 888 in the address1 field, 77777 for zip.
   * To simulate a CVV match, pass 999 in the cvv field.
   *
   */
  setTestTrx() {
    this.test = true;
  }

  setLogin(security_key) {
    this.login["security_key"] = security_key;
  }

  stringify(postData) {
    postData.security_key = encodeURIComponent(this.login["security_key"]);
    var query = querystring.stringify(postData);
    return query;
  }

  setOrder(orderid, orderdescription, tax, shipping, ponumber, ipaddress) {
    this.order["orderid"] = orderid;
    this.order["orderdescription"] = orderdescription;
    this.order["tax"] = tax;
    this.order["shipping"] = shipping;
    this.order["ponumber"] = ponumber;
    this.order["ipaddress"] = ipaddress;
  }

  setBilling(billingInformation) {
    // Validate that passed in information contains valid keys
    const validBillingKeys = [
      "first_name",
      "last_name",
      "company",
      "address1",
      "address2",
      "city",
      "state",
      "zip",
      "country",
      "phone",
      "fax",
      "email",
      "website",
    ];

    for (let key in billingInformation) {
      if (!validBillingKeys.includes(key)) {
        throw new Error(`Invalid key provided in billingInformation. '${key}'
            is not a valid billing parameter.`);
      }
    }

    this.billing = billingInformation;
  }

  setShipping(shippingInformation) {
    // Validate that passed in information contains valid keys
    const validShippingKeys = [
      "shipping_first_name",
      "shipping_last_name",
      "shipping_company",
      "shipping_address1",
      "shipping_address2",
      "address2",
      "shipping_city",
      "shipping_state",
      "shipping_zip",
      "shipping_country",
      "shipping_email",
    ];

    for (let key in shippingInformation) {
      if (!validShippingKeys.includes(key)) {
        throw new Error(`Invalid key provided in shippingInformation. '${key}'
            is not a valid shipping parameter.`);
      }
    }

    this.shipping = shippingInformation;
  }

  setPaymentMethod(paymentMethodDetails) {
    const validPaymentMethodKeys = [
      "payment",
      "ccnumber",
      "ccexp",
      "cvv",
      "checkname",
      "checkaba",
      "checkaccount",
      "account_holder_type",
      "account_type",
    ];

    for (let key in paymentMethodDetails) {
      if (!validPaymentMethodKeys.includes(key)) {
        throw new Error(`Invalid key provided in shippingInformation. '${key}'
            is not a valid shipping parameter.`);
      }
    }
    this.paymentMethod = paymentMethodDetails;
  }

  addProduct({
    product_sku,
    product_description,
    product_cost,
    product_currency,
    product_commodity_code,
    product_unit_of_measure,
    product_tax_amount,
    product_discount_amount,
    product_image_data,
    product_image_name,
  }) {
    var query = "";
    // Login Information
    query +=
      "security_key=" + encodeURIComponent(this.login["security_key"]) + "&";
    query += "products=" + encodeURIComponent("add_product") + "&";
    query += "product_sku=" + encodeURIComponent(product_sku) + "&";
    query +=
      "product_description=" + encodeURIComponent(product_description) + "&";
    query +=
      "product_cost=" +
      encodeURIComponent(number_format(product_cost, 2, ".", "")) +
      "&";
    query += "product_currency=" + encodeURIComponent(product_currency) + "&";
    query +=
      "product_commodity_code=" +
      encodeURIComponent(product_commodity_code) +
      "&";
    query +=
      "product_unit_of_measure=" +
      encodeURIComponent(product_unit_of_measure) +
      "&";
    query +=
      "product_tax_amount=" +
      encodeURIComponent(number_format(product_tax_amount, 2, ".", "")) +
      "&";
    query +=
      "product_discount_amount=" +
      encodeURIComponent(number_format(product_discount_amount, 2, ".", "")) +
      "&";
    query +=
      "product_image_data=" + encodeURIComponent(product_image_data) + "&";
    query +=
      "product_image_name=" + encodeURIComponent(product_image_name) + "&";
    return this._doPost(query);
  }

  updateProduct({
    product_id,
    product_sku,
    product_description,
    product_cost,
    product_currency,
    product_commodity_code,
    product_unit_of_measure,
    product_tax_amount,
    product_discount_amount,
    product_image_data,
    product_image_name,
  }) {
    var query = "";
    // Login Information
    query +=
      "security_key=" + encodeURIComponent(this.login["security_key"]) + "&";
    query += "product_id=" + encodeURIComponent(product_id) + "&";
    query += "product_sku=" + encodeURIComponent(product_sku) + "&";
    query +=
      "product_description=" + encodeURIComponent(product_description) + "&";
    query +=
      "product_cost=" +
      encodeURIComponent(number_format(product_cost, 2, ".", "")) +
      "&";
    query += "product_currency=" + encodeURIComponent(product_currency) + "&";
    query +=
      "product_commodity_code=" +
      encodeURIComponent(product_commodity_code) +
      "&";
    query +=
      "product_unit_of_measure=" +
      encodeURIComponent(product_unit_of_measure) +
      "&";
    query +=
      "product_tax_amount=" +
      encodeURIComponent(number_format(product_tax_amount, 2, ".", "")) +
      "&";
    query +=
      "product_discount_amount=" +
      encodeURIComponent(number_format(product_discount_amount, 2, ".", "")) +
      "&";
    query +=
      "product_image_data=" + encodeURIComponent(product_image_data) + "&";
    query +=
      "product_image_name=" + encodeURIComponent(product_image_name) + "&";
    return this._doPost(query);
  }

  deleteProduct(product_id) {
    var query = "";
    // Login Information
    query +=
      "security_key=" + encodeURIComponent(this.login["security_key"]) + "&";
    query += "products=" + encodeURIComponent("delete_product") + "&";
    query += "product_id=" + encodeURIComponent(this.login["product_id"]) + "&";
    return this._doPost(query);
  }

  /*
  trxVar = Schema({
    type: {
      type: String,
      enum: [
        "sale",
        "auth",
        "credit",
        "validate",
        "offline",
        "capture",
        "void",
        "refund",
        "update",
      ],
      default: "sale",
    },
    security_key: String,
    payment_token: String,
    ccnumber: Number,
    ccexp: Number,
    cvv: Number,
    checkname: String,
    checkaba: Number,
    checkaccount: Number,
    account_holder_type: {
      type: String,
      enum: ["business", "personal"],
      default: "personal",
    },
    account_type: {
      type: String,
      enum: ["checking", "savings"],
      default: "checking",
    },
    sec_code: {
      type: String,
      enum: ["PPD", "WEB", "TEL", "CCD"],
      default: "WEB",
    },
    amount: { type: Decimal, default: "0.00" },
    surcharge: Decimal,
    currency: {
      type: String,
      enum: [
        "AFG",
        "ALB",
        "DZA",
        "ASM",
        "AND",
        "AGO",
        "AIA",
        "ATA",
        "ATG",
        "ARG",
        "ARM",
        "ABW",
        "AUS",
        "AUT",
        "AZE",
        "BHS",
        "BHR",
        "BGD",
        "BRB",
        "BLR",
        "BEL",
        "BLZ",
        "BEN",
        "BMU",
        "BTN",
        "BOL",
        "BES",
        "BIH",
        "BWA",
        "BVT",
        "BRA",
        "IOT",
        "BRN",
        "BGR",
        "BFA",
        "BDI",
        "CPV",
        "KHM",
        "CMR",
        "CAN",
        "CYM",
        "CAF",
        "TCD",
        "CHL",
        "CHN",
        "CXR",
        "CCK",
        "COL",
        "COM",
        "COD",
        "COG",
        "COK",
        "CRI",
        "HRV",
        "CUB",
        "CUW",
        "CYP",
        "CZE",
        "CIV",
        "DNK",
        "DJI",
        "DMA",
        "DOM",
        "ECU",
        "EGY",
        "SLV",
        "GNQ",
        "ERI",
        "EST",
        "SWZ",
        "ETH",
        "FLK",
        "FRO",
        "FJI",
        "FIN",
        "FRA",
        "GUF",
        "PYF",
        "ATF",
        "GAB",
        "GMB",
        "GEO",
        "DEU",
        "GHA",
        "GIB",
        "GRC",
        "GRL",
        "GRD",
        "GLP",
        "GUM",
        "GTM",
        "GGY",
        "GIN",
        "GNB",
        "GUY",
        "HTI",
        "HMD",
        "VAT",
        "HND",
        "HKG",
        "HUN",
        "ISL",
        "IND",
        "IDN",
        "IRN",
        "IRQ",
        "IRL",
        "IMN",
        "ISR",
        "ITA",
        "JAM",
        "JPN",
        "JEY",
        "JOR",
        "KAZ",
        "KEN",
        "KIR",
        "PRK",
        "KOR",
        "KWT",
        "KGZ",
        "LAO",
        "LVA",
        "LBN",
        "LSO",
        "LBR",
        "LBY",
        "LIE",
        "LTU",
        "LUX",
        "MAC",
        "MDG",
        "MWI",
        "MYS",
        "MDV",
        "MLI",
        "MLT",
        "MHL",
        "MTQ",
        "MRT",
        "MUS",
        "MYT",
        "MEX",
        "FSM",
        "MDA",
        "MCO",
        "MNG",
        "MNE",
        "MSR",
        "MAR",
        "MOZ",
        "MMR",
        "NAM",
        "NRU",
        "NPL",
        "NLD",
        "NCL",
        "NZL",
        "NIC",
        "NER",
        "NGA",
        "NIU",
        "NFK",
        "MKD",
        "MNP",
        "NOR",
        "OMN",
        "PAK",
        "PLW",
        "PSE",
        "PAN",
        "PNG",
        "PRY",
        "PER",
        "PHL",
        "PCN",
        "POL",
        "PRT",
        "PRI",
        "QAT",
        "ROU",
        "RUS",
        "RWA",
        "REU",
        "BLM",
        "SHN",
        "KNA",
        "LCA",
        "MAF",
        "SPM",
        "VCT",
        "WSM",
        "SMR",
        "STP",
        "SAU",
        "SEN",
        "SRB",
        "SYC",
        "SLE",
        "SGP",
        "SXM",
        "SVK",
        "SVN",
        "SLB",
        "SOM",
        "ZAF",
        "SGS",
        "SSD",
        "ESP",
        "LKA",
        "SDN",
        "SUR",
        "SJM",
        "SWE",
        "CHE",
        "SYR",
        "TWN",
        "TJK",
        "TZA",
        "THA",
        "TLS",
        "TGO",
        "TKL",
        "TON",
        "TTO",
        "TUN",
        "TUR",
        "TKM",
        "TCA",
        "TUV",
        "UGA",
        "UKR",
        "ARE",
        "GBR",
        "UMI",
        "USA",
        "URY",
        "UZB",
        "VUT",
        "VEN",
        "VNM",
        "VGB",
        "VIR",
        "WLF",
        "ESH",
        "YEM",
        "ZMB",
        "ZWE",
        "ALA",
      ],
      default: "USD", //See ISO 4217
    },
    payment: {
      type: String,
      enum: ["creditcard", "check", "cash"],
      default: "creditcard",
    },
    processor_id: String,
    authorization_code: String,
    dup_seconds: { type: Number, default: 0, max: 7862400 },
    descriptor: String,
    descriptor_phone: String,
    descriptor_address: String,
    descriptor_city: String,
    descriptor_state: String,
    descriptor_postal: String,
    descriptor_country: String,
    descriptor_mcc: String,
    descriptor_merchant_id: String,
    descriptor_url: String,
    billing_method: { type: String, enum: ["recurring", "installment"] },
    billing_number: { type: Number, min: 0, max: 99 },
    billing_total: Decimal,
    order_template: String,
    order_description: String,
    orderid: String,
    ipaddress: String, //Format: xxx.xxx.xxx.xxx
    tax: Decimal,
    shipping: Decimal,
    ponumber: String,
    first_name: String,
    last_name: String,
    company: String,
    address1: String,
    address2: String,
    city: String,
    state: String, //Format: CC
    zip: String,
    country: {
      type: String, //ISO 3155 Format: CC
      default: "US",
    },
    phone: String,
    fax: String,
    email: String,
    social_security_number: String,
    drivers_license_number: String,
    drivers_license_dob: String,
    drivers_license_state: String,
    shipping_firstname: String,
    shipping_lastname: String,
    shipping_company: String,
    shipping_address1: String,
    shipping_address2: String,
    shipping_city: String,
    shipping_state: String, //Format: CC
    shipping_zip: String,
    shipping_country: String, //ISO 3166. Format: CC
    shipping_email: String,
    merchant_defined_field_1: Mixed,
    merchant_defined_field_2: Mixed,
    merchant_defined_field_3: Mixed,
    merchant_defined_field_4: Mixed,
    merchant_defined_field_5: Mixed,
    merchant_defined_field_6: Mixed,
    merchant_defined_field_7: Mixed,
    merchant_defined_field_8: Mixed,
    merchant_defined_field_9: Mixed,
    merchant_defined_field_10: Mixed,
    merchant_defined_field_11: Mixed,
    merchant_defined_field_12: Mixed,
    merchant_defined_field_13: Mixed,
    merchant_defined_field_14: Mixed,
    merchant_defined_field_15: Mixed,
    merchant_defined_field_16: Mixed,
    merchant_defined_field_17: Mixed,
    merchant_defined_field_18: Mixed,
    merchant_defined_field_19: Mixed,
    merchant_defined_field_20: Mixed,
    customer_receipt: Boolean,
    signature_image: String,
    cardholder_auth: { type: String, enum: ["verified", "attempted"] },
    eci: { type: Number, enum: [0, 1, 2, 5, 6, 7] },
    cavv: String,
    xid: String,
    three_ds_version: { type: String, enum: ["1.0.2", "2.0"] },
    directory_server_id: String,
    source_transaction_id: String,
    recurring: String,
    plan_id: String,
    plan_payments: Number,
    plan_amount: Decimal,
    day_frequency: Number,
    month_frequency: { type: Number, min: 1, max: 24 },
    day_of_month: { type: Number, min: 1, max: 31 },
    start_date: String, //Format YYYYMMDD
    //Customer Vault Specific Fields
    customer_vault: {
      type: String,
      enum: ["add_customer", "update_customer"],
      default: "add_customer",
    },
    customer_vault_id: String,
    //Stored Credentials
    initiated_by: {
      type: String,
      enum: ["customer", "merchant"],
      default: "customer",
    },
    inital_transaction_id: String,
    stored_credential_indicator: {
      type: String,
      enum: ["stored", "used"],
      default: "stored",
    },
    //Level 3 specific order fields
    shipping: {
      type: Decimal,
      default: "0.00",
    },
    tax: {
      type: Decimal,
      default: "0.00",
    },
    ponumber: String,
    orderid: String,
    shipping_country: String,
    shipping_postal: String,
    ship_from_postal: String,
    summary_commodity_code: String,
    duty_amount: {
      type: Decimal,
      default: "0.00",
    },
    discount_amount: {
      type: Decimal,
      default: "0.00",
    },
    national_tax_amount: {
      type: Decimal,
      default: "0.00",
    },
    alternate_tax_amount: {
      type: Decimal,
      default: "0.00",
    },
    alternate_tax_id: String,
    vat_tax_amount: {
      type: Decimal,
      default: "0.00",
    },
    vat_tax_rate: {
      type: Decimal,
      default: "0.00",
    },
    vat_invoice_reference_number: String,
    customer_vat_registration: String,
    merchant_vat_registration: String,
    order_date: String, //Format: YYMMDD
    //Level 3 Specific Line Item Detail Fields

    //Create Invoice
    invoicing: {
      type: String,
      enum: ["add_invoice", "update_invoice", "send_invoice", "close_invoice"],
      default: "add_invoice",
    },
    payment_terms: { type: String, default: "upon_receipt" },
    payment_methods_allowed: String, //Values: 'cc', 'ck', and 'cs'.
    customer_id: String,
    customer_tax_id: String,
    website: String,
    fax: String,
    invoice_id: String,
    //Passing Unecrypted Retail Magnetic Stripe Data
    track_1: Buffer,
    track_2: Buffer,
    track_3: Buffer,
    //Passing MagTek Magensa Encrypted Magnetic Stripe Data
    magnesafe_track_1: Buffer,
    magnesafe_track_2: Buffer,
    magnesafe_magneprint: Buffer,
    magnesafe_ksn: Buffer,
    magnesafe_magneprint_status: Buffer,
    //Passing IDTech M130 Exrypted Swipe Data
    encrypted_track_1: Buffer,
    encrypted_track_2: Buffer,
    encrypted_track_3: Buffer,
    encrypted_ksn: Buffer,
    //Passing Ingenico Telium 2 Chip Card Data
    entry_mode: {
      type: String,
      enum: ["emv_icc", "swiped", "swiped_emv_fallback", "nfc_msd", "keyed"],
      default: "emv_icc",
    },
    emv_auth_request_Data: String,
    emv_device: {
      type: String,
      default: "ingenico_rba",
    },
    verification_method: {
      type: String,
      enum: ["signature", "offline_pin", "offline_pin_signature", "none"],
      default: "none",
    },
    applepay_payment_data: String,
  });

  */
  // Transaction Functions

  doSale({
    amount,
  }) {
    let requestOptions = {
      type: "sale",
      amount: number_format(amount, 2, ".", ""),
    };
    if (this.test) {
      requestOptions.test_mode = "enabled";
    }
    // Merge together all request options into one object
    Object.assign(requestOptions, this.paymentMethod, this.billing, this.shipping);
    
    //create the query.
    var query = this.stringify(requestOptions);

    return this._doPost(query);
  }

  doAuth({
    amount,
  }) {
    let requestOptions = {
      type: "auth",
      amount: number_format(amount, 2, ".", ""),
    };
    if (this.test) {
      requestOptions.test_mode = "enabled";
    }
    // Merge together all request options into one object
    Object.assign(requestOptions, this.paymentMethod, this.billing, this.shipping);

    //create the query.
    var query = this.stringify(requestOptions);
    
    return this._doPost(query);
  }

  doCredit({
    amount
  }) {
    let requestOptions = {
      type: "credit",
      amount: number_format(amount, 2, ".", ""),
    };
    if (this.test) {
      requestOptions.test_mode = "enabled";
    }
    
    // Merge together all request options into one object
    Object.assign(requestOptions, this.paymentMethod, this.billing, this.shipping);

    //create the query.
    var query = this.stringify(requestOptions);
    /*
    var query = "";
    // Login Information
    query +=
      "security_key=" + encodeURIComponent(this.login["security_key"]) + "&";
    // Sales Information
    if (method === "creditcard") {
      query += "payment=" + encodeURIComponent(method) + "&";
      query += "ccnumber=" + encodeURIComponent(ccnumber) + "&";
      query += "ccexp=" + encodeURIComponent(ccexp) + "&";
      query += "cvv=" + encodeURIComponent(cvv) + "&";
    }
    if (method === "check") {
      query += "payment=" + encodeURIComponent(method) + "&";
      query += "checkname=" + encodeURIComponent(checkname) + "&";
      query += "checkaba=" + encodeURIComponent(checkaba) + "&";
      query += "checkaccount=" + encodeURIComponent(checkaccount) + "&";
      query +=
        "account_holder_type=" + encodeURIComponent(account_holder_type) + "&";
      query += "account_type=" + encodeURIComponent(account_type) + "&";
    }
    query +=
      "amount=" + encodeURIComponent(number_format(amount, 2, ".", "")) + "&";
    // Order Information
    query += "ipaddress=" + encodeURIComponent(this.order["ipaddress"]) + "&";
    query += "orderid=" + encodeURIComponent(this.order["orderid"]) + "&";
    query +=
      "orderdescription=" +
      encodeURIComponent(this.order["orderdescription"]) +
      "&";
    query +=
      "tax=" +
      encodeURIComponent(number_format(this.order["tax"], 2, ".", "")) +
      "&";
    query +=
      "shipping=" +
      encodeURIComponent(number_format(this.order["shipping"], 2, ".", "")) +
      "&";
    query += "ponumber=" + encodeURIComponent(this.order["ponumber"]) + "&";
    // Billing Information
    query += "firstname=" + encodeURIComponent(this.billing["firstname"]) + "&";
    query += "lastname=" + encodeURIComponent(this.billing["lastname"]) + "&";
    query += "company=" + encodeURIComponent(this.billing["company"]) + "&";
    query += "address1=" + encodeURIComponent(this.billing["address1"]) + "&";
    query += "address2=" + encodeURIComponent(this.billing["address2"]) + "&";
    query += "city=" + encodeURIComponent(this.billing["city"]) + "&";
    query += "state=" + encodeURIComponent(this.billing["state"]) + "&";
    query += "zip=" + encodeURIComponent(this.billing["zip"]) + "&";
    query += "country=" + encodeURIComponent(this.billing["country"]) + "&";
    query += "phone=" + encodeURIComponent(this.billing["phone"]) + "&";
    query += "fax=" + encodeURIComponent(this.billing["fax"]) + "&";
    query += "email=" + encodeURIComponent(this.billing["email"]) + "&";
    query += "website=" + encodeURIComponent(this.billing["website"]) + "&";
    query += "type=credit";
    */
    return this._doPost(query);
  }

  doOffline(authorizationcode, amount, ccnumber, ccexp) {
    var query = "";
    // Login Information
    query += "security_key=" + urlencode(this.login["security_key"]) + "&";
    // Sales Information
    query += "ccnumber=" + urlencode(ccnumber) + "&";
    query += "ccexp=" + urlencode(ccexp) + "&";

    query += "amount=" + urlencode(number_format(amount, 2, ".", "")) + "&";
    query += "authorizationcode=" + urlencode(authorizationcode) + "&";
    // Order Information
    query += "ipaddress=" + urlencode(this.order["ipaddress"]) + "&";
    query += "orderid=" + urlencode(this.order["orderid"]) + "&";
    query +=
      "orderdescription=" + urlencode(this.order["orderdescription"]) + "&";
    query +=
      "tax=" + urlencode(number_format(this.order["tax"], 2, ".", "")) + "&";
    query +=
      "shipping=" +
      urlencode(number_format(this.order["shipping"], 2, ".", "")) +
      "&";
    query += "ponumber=" + urlencode(this.order["ponumber"]) + "&";
    // Billing Information
    query += "firstname=" + urlencode(this.billing["firstname"]) + "&";
    query += "lastname=" + urlencode(this.billing["lastname"]) + "&";
    query += "company=" + urlencode(this.billing["company"]) + "&";
    query += "address1=" + urlencode(this.billing["address1"]) + "&";
    query += "address2=" + urlencode(this.billing["address2"]) + "&";
    query += "city=" + urlencode(this.billing["city"]) + "&";
    query += "state=" + urlencode(this.billing["state"]) + "&";
    query += "zip=" + urlencode(this.billing["zip"]) + "&";
    query += "country=" + urlencode(this.billing["country"]) + "&";
    query += "phone=" + urlencode(this.billing["phone"]) + "&";
    query += "fax=" + urlencode(this.billing["fax"]) + "&";
    query += "email=" + urlencode(this.billing["email"]) + "&";
    query += "website=" + urlencode(this.billing["website"]) + "&";
    // Shipping Information
    query +=
      "shipping_firstname=" + urlencode(this.shipping["firstname"]) + "&";
    query += "shipping_lastname=" + urlencode(this.shipping["lastname"]) + "&";
    query += "shipping_company=" + urlencode(this.shipping["company"]) + "&";
    query += "shipping_address1=" + urlencode(this.shipping["address1"]) + "&";
    query += "shipping_address2=" + urlencode(this.shipping["address2"]) + "&";
    query += "shipping_city=" + urlencode(this.shipping["city"]) + "&";
    query += "shipping_state=" + urlencode(this.shipping["state"]) + "&";
    query += "shipping_zip=" + urlencode(this.shipping["zip"]) + "&";
    query += "shipping_country=" + urlencode(this.shipping["country"]) + "&";
    query += "shipping_email=" + urlencode(this.shipping["email"]) + "&";
    query += "type=offline";
    return this._doPost(query);
  }

  doCapture(transactionid, amount = 0) {
    let requestOptions = {
      type: "capture",
      amount: number_format(amount, 2, ".", ""),
    };
    if (this.test) {
      requestOptions.test_mode = "enabled";
    }
    requestOptions.transactionid = transactionid;

    var query = this.stringify(requestOptions);

    return this._doPost(query);
  }

  doVoid(transactionid) {
    let requestOptions = {
      type: "void",
    };
    if (this.test) {
      requestOptions.test_mode = "enabled";
    }
    requestOptions.transactionid = transactionid;

    var query = this.stringify(requestOptions);

    return this._doPost(query);
  }

  doRefund(transactionid, amount = 0) {
    let requestOptions = {
      type: "refund",
      amount: number_format(amount, 2, ".", ""),
    };
    if (this.test) {
      requestOptions.test_mode = "enabled";
    }
    requestOptions.transactionid = transactionid;

    var query = this.stringify(requestOptions);

    return this._doPost(query);
  }

  createInvoice({
    payment_terms,
    payment_methods_allowed = "cc,ck,cs",
    amount,
    customer_id,
    customer_tax_id,
    currency,
    merchant_defined_field_1,
    merchant_defined_field_2,
    merchant_defined_field_3,
    merchant_defined_field_4,
    merchant_defined_field_5,
    merchant_defined_field_6,
    merchant_defined_field_7,
    merchant_defined_field_8,
    merchant_defined_field_9,
    merchant_defined_field_10,
    merchant_defined_field_11,
    merchant_defined_field_12,
    merchant_defined_field_13,
    merchant_defined_field_14,
    merchant_defined_field_15,
    merchant_defined_field_16,
    merchant_defined_field_17,
    merchant_defined_field_18,
    merchant_defined_field_19,
    merchant_defined_field_20,
  }) {
    var query = "";
    // Login Information
    query +=
      "security_key=" + encodeURIComponent(this.login["security_key"]) + "&";
    query += "invoicing=" + encodeURIComponent("add_invoice") + "&";
    query += "payment_terms=" + encodeURIComponent(payment_terms) + "&"; //	When the invoice should be paid Values: 'upon_receipt', or integers from 0-999.
    query +=
      "payment_methods_allowed=" +
      encodeURIComponent(payment_methods_allowed) +
      "&";

    query += "currency=" + encodeURIComponent(currency) + "&";
    query +=
      "amount=" + encodeURIComponent(number_format(amount, 2, ".", "")) + "&";
    // Order Information
    query += "orderid=" + encodeURIComponent(this.order["orderid"]) + "&";
    query +=
      "orderdescription=" +
      encodeURIComponent(this.order["orderdescription"]) +
      "&";
    query +=
      "tax=" +
      encodeURIComponent(number_format(this.order["tax"], 2, ".", "")) +
      "&";
    query +=
      "shipping=" +
      encodeURIComponent(number_format(this.order["shipping"], 2, ".", "")) +
      "&";
    query += "ponumber=" + encodeURIComponent(this.order["ponumber"]) + "&";

    // Billing Information
    query += "firstname=" + encodeURIComponent(this.billing["firstname"]) + "&";
    query += "lastname=" + encodeURIComponent(this.billing["lastname"]) + "&";
    query += "company=" + encodeURIComponent(this.billing["company"]) + "&";
    query += "address1=" + encodeURIComponent(this.billing["address1"]) + "&";
    query += "address2=" + encodeURIComponent(this.billing["address2"]) + "&";
    query += "city=" + encodeURIComponent(this.billing["city"]) + "&";
    query += "state=" + encodeURIComponent(this.billing["state"]) + "&";
    query += "zip=" + encodeURIComponent(this.billing["zip"]) + "&";
    query += "country=" + encodeURIComponent(this.billing["country"]) + "&";
    query += "phone=" + encodeURIComponent(this.billing["phone"]) + "&";
    query += "fax=" + encodeURIComponent(this.billing["fax"]) + "&";
    query += "email=" + encodeURIComponent(this.billing["email"]) + "&";
    query += "website=" + encodeURIComponent(this.billing["website"]) + "&";
    // Shipping Information
    query +=
      "shipping_firstname=" +
      encodeURIComponent(this.shipping["firstname"]) +
      "&";
    query +=
      "shipping_lastname=" +
      encodeURIComponent(this.shipping["lastname"]) +
      "&";
    query +=
      "shipping_company=" + encodeURIComponent(this.shipping["company"]) + "&";
    query +=
      "shipping_address1=" +
      encodeURIComponent(this.shipping["address1"]) +
      "&";
    query +=
      "shipping_address2=" +
      encodeURIComponent(this.shipping["address2"]) +
      "&";
    query += "shipping_city=" + encodeURIComponent(this.shipping["city"]) + "&";
    query +=
      "shipping_state=" + encodeURIComponent(this.shipping["state"]) + "&";
    query += "shipping_zip=" + encodeURIComponent(this.shipping["zip"]) + "&";
    query +=
      "shipping_country=" + encodeURIComponent(this.shipping["country"]) + "&";
    query +=
      "shipping_email=" + encodeURIComponent(this.shipping["email"]) + "&";

    query += "customer_id=" + encodeURIComponent(customer_id) + "&";
    query += "customer_tax_id=" + encodeURIComponent(customer_tax_id) + "&";
    query +=
      "merchant_defined_field_1=" +
      encodeURIComponent(merchant_defined_field_1) +
      "&";
    query +=
      "merchant_defined_field_2=" +
      encodeURIComponent(merchant_defined_field_2) +
      "&";
    query +=
      "merchant_defined_field_3=" +
      encodeURIComponent(merchant_defined_field_3) +
      "&";
    query +=
      "merchant_defined_field_4=" +
      encodeURIComponent(merchant_defined_field_4) +
      "&";
    query +=
      "merchant_defined_field_5=" +
      encodeURIComponent(merchant_defined_field_5) +
      "&";
    query +=
      "merchant_defined_field_6=" +
      encodeURIComponent(merchant_defined_field_6) +
      "&";
    query +=
      "merchant_defined_field_7=" +
      encodeURIComponent(merchant_defined_field_7) +
      "&";
    query +=
      "merchant_defined_field_8=" +
      encodeURIComponent(merchant_defined_field_8) +
      "&";
    query +=
      "merchant_defined_field_9=" +
      encodeURIComponent(merchant_defined_field_9) +
      "&";
    query +=
      "merchant_defined_field_10=" +
      encodeURIComponent(merchant_defined_field_10) +
      "&";
    query +=
      "merchant_defined_field_11=" +
      encodeURIComponent(merchant_defined_field_11) +
      "&";
    query +=
      "merchant_defined_field_12=" +
      encodeURIComponent(merchant_defined_field_12) +
      "&";
    query +=
      "merchant_defined_field_13=" +
      encodeURIComponent(merchant_defined_field_13) +
      "&";
    query +=
      "merchant_defined_field_14=" +
      encodeURIComponent(merchant_defined_field_14) +
      "&";
    query +=
      "merchant_defined_field_15=" +
      encodeURIComponent(merchant_defined_field_15) +
      "&";
    query +=
      "merchant_defined_field_16=" +
      encodeURIComponent(merchant_defined_field_16) +
      "&";
    query +=
      "merchant_defined_field_17=" +
      encodeURIComponent(merchant_defined_field_17) +
      "&";
    query +=
      "merchant_defined_field_18=" +
      encodeURIComponent(merchant_defined_field_18) +
      "&";
    query +=
      "merchant_defined_field_19=" +
      encodeURIComponent(merchant_defined_field_19) +
      "&";
    query +=
      "merchant_defined_field_20=" +
      encodeURIComponent(merchant_defined_field_20);
    return this._doPost(query);
  }

  addInvoiceItem(
    invoiceItem = {
      item_product_code,
      item_description,
      item_commodity_code,
      item_unit_of_measure: "EACH",
      item_unit_cost,
      item_quantity,
      item_total_amount,
      item_tax_amount,
      item_tax_rate,
      item_discount_amount,
      item_discount_rate,
      item_tax_type,
      item_alternate_tax_id,
    }
  ) {
    /*
    item_product_code_#	Merchant defined description code of the item being purchased.
item_description_#	Description of the item(s) being supplied.
item_commodity_code_#	International description code of the individual good or service being supplied. The acquirer or processor will provide a list of current codes.
item_unit_of_measure_#	Code for units of measurement as used in international trade.
Default: 'EACH'
item_unit_cost_#	Unit cost of item purchased, may contain up to 4 decimal places.
item_quantity_#	Quantity of the item(s) being purchased.
Default: '1'
item_total_amount_#	Purchase amount associated with the item. Defaults to: 'item_unit_cost_#' x 'item_quantity_#' rounded to the nearest penny.
item_tax_amount_#	Amount of tax on specific item, amount should not be included in 'total_amount_#'.
Default: '0.00'
item_tax_rate_#	Percentage representing the value-added tax applied.
Default: '0.00'
item_discount_amount_#	Discount amount which can have been applied by the merchant on the sale of the specific item. Amount should not be included in 'total_amount_#'.
item_discount_rate_#	Discount rate for the line item. 1% = 1.00.
Default: '0.00'
item_tax_type_#	Type of value-added taxes that are being used.
item_alternate_tax_id_#	Tax identification number of the merchant that reported the alternate tax amount.
*/
    this.items.push(invoiceItem);
  }

  setResponse(responseText) {
    this.responses = responseText;
  }

  getResponse() {
    return this.responses;
  }

  _doPost(query) {
    const endPoint = "https://secure.safewebservices.com/api/transact.php";
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", endPoint, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
      // Call a function when the state changes.
      if (xhr.status === 200 && xhr.readyState === 4) {
        this.setResponse(xhr.responseText);
        this.cb(this.getResponse());
      }
      return false;
    };
    xhr.send(query);
  }
}

module.exports = {
  number_format,
  gwapi,
};
