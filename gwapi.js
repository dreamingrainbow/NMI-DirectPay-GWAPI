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
    this.cb = cb.bind(this);
  }
  // Initial Setting Functions

  setLogin(security_key) {
    this.login["security_key"] = security_key;
  }

  setOrder(orderid, orderdescription, tax, shipping, ponumber, ipaddress) {
    this.order["orderid"] = orderid;
    this.order["orderdescription"] = orderdescription;
    this.order["tax"] = tax;
    this.order["shipping"] = shipping;
    this.order["ponumber"] = ponumber;
    this.order["ipaddress"] = ipaddress;
  }

  setBilling(
    firstname,
    lastname,
    company,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    phone,
    fax,
    email,
    website
  ) {
    this.billing["firstname"] = firstname;
    this.billing["lastname"] = lastname;
    this.billing["company"] = company;
    this.billing["address1"] = address1;
    this.billing["address2"] = address2;
    this.billing["city"] = city;
    this.billing["state"] = state;
    this.billing["zip"] = zip;
    this.billing["country"] = country;
    this.billing["phone"] = phone;
    this.billing["fax"] = fax;
    this.billing["email"] = email;
    this.billing["website"] = website;
  }

  setShipping(
    firstname,
    lastname,
    company,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    email
  ) {
    this.shipping["firstname"] = firstname;
    this.shipping["lastname"] = lastname;
    this.shipping["company"] = company;
    this.shipping["address1"] = address1;
    this.shipping["address2"] = address2;
    this.shipping["city"] = city;
    this.shipping["state"] = state;
    this.shipping["zip"] = zip;
    this.shipping["country"] = country;
    this.shipping["email"] = email;
  }

  // Transaction Functions

  doSale(amount, ccnumber, ccexp, cvv = "") {
    let query = "";
    // Login Information
    query +=
      "security_key=" + encodeURIComponent(this.login["security_key"]) + "&";
    // Sales Information
    query += "ccnumber=" + encodeURIComponent(ccnumber) + "&";
    query += "ccexp=" + encodeURIComponent(ccexp) + "&";
    query +=
      "amount=" + encodeURIComponent(number_format(amount, 2, ".", "")) + "&";
    query += "cvv=" + encodeURIComponent(cvv) + "&";
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
    query += "type=sale";
    return this._doPost(query);
  }

  doAuth(amount, ccnumber, ccexp, cvv = "") {
    const query = "";
    // Login Information
    query += "security_key=" + urlencode(this.login["security_key"]) + "&";
    // Sales Information
    query += "ccnumber=" + urlencode(ccnumber) + "&";
    query += "ccexp=" + urlencode(ccexp) + "&";
    query += "amount=" + urlencode(number_format(amount, 2, ".", "")) + "&";
    query += "cvv=" + urlencode(cvv) + "&";
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
    query += "type=auth";
    return this._doPost(query);
  }

  doCredit(amount, ccnumber, ccexp) {
    const query = "";
    // Login Information
    query += "security_key=" + urlencode(this.login["security_key"]) + "&";
    // Sales Information
    query += "ccnumber=" + urlencode(ccnumber) + "&";
    query += "ccexp=" + urlencode(ccexp) + "&";
    query += "amount=" + urlencode(number_format(amount, 2, ".", "")) + "&";
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
    query += "type=credit";
    return this._doPost(query);
  }

  doOffline(authorizationcode, amount, ccnumber, ccexp) {
    const query = "";
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
    const query = "";
    // Login Information
    query += "security_key=" + urlencode(this.login["security_key"]) + "&";
    // Transaction Information
    query += "transactionid=" + urlencode(transactionid) + "&";
    if (amount > 0) {
      query += "amount=" + urlencode(number_format(amount, 2, ".", "")) + "&";
    }
    query += "type=capture";
    return this._doPost(query);
  }

  doVoid(transactionid) {
    const query = "";
    // Login Information
    query += "security_key=" + urlencode(this.login["security_key"]) + "&";
    // Transaction Information
    query += "transactionid=" + urlencode(transactionid) + "&";
    query += "type=void";
    return this._doPost(query);
  }

  doRefund(transactionid, amount = 0) {
    const query = "";
    // Login Information
    query += "security_key=".urlencode(this.login["security_key"]) + "&";
    // Transaction Information
    query += "transactionid=".urlencode(transactionid) + "&";
    if (amount > 0) {
      query += "amount=".urlencode(number_format(amount, 2, ".", "")) + "&";
    }
    query += "type=refund";
    return this._doPost(query);
  }
  setResponse(responseText) {
    this.responses = responseText;
  }
  getResponse() {
    return this.responses;
  }

  _doPost(query) {
    const endPoint =
      this.staging === "Production"
        ? ""
        : "https://secure.safewebservices.com/api/transact.php";
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", endPoint, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
      // Call a function when the state changes.
      if(xhr.status === 200 && xhr.readyState === 4 ) {
        this.setResponse(xhr.responseText);
        this.cb(this.getResponse());
      }
      return false;
    };
    xhr.send(query);
  }
}
