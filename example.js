const { gwapi } = require("./gwapi");

class Example {
  response = {};
  splitResult(responses) {
    const _responses = {};
    responses.split("&").forEach((response) => {
      const r = response.split("=");
      _responses[r[0]] = r[1];
    });
    this.response = _responses;
    return this.response;
  }

  static doSale() {
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Response was", response);
    });

    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");

    gw.setBilling({
      first_name: "John",
      last_name: "Smith",
      company: "Acme, Inc.",
      address1: "123 Main St",
      address2: "Suite 200",
      city: "Beverly Hills",
      state: "CA",
      zip: "90210",
      country: "US",
      phone: "555-555-5555",
      fax: "555-555-5556",
      email: "support@example.com",
      website: "www.example.com",
    });

    gw.setShipping({
      shipping_first_name: "Mary",
      shipping_last_name: "Smith",
      shipping_company: "na",
      shipping_address1: "124 Shipping Main St",
      shipping_address2: "Suite Ship",
      shipping_city: "Beverly Hills",
      shipping_state: "CA",
      shipping_zip: "90210",
      shipping_country: "US",
      shipping_email: "support@example.com",
    });

    var amount = "50.00";
    var ccnumber = "4111111111111111";
    var ccexp = "1010";
    var cvv = "";

    gw.setOrder("1234", "Big Order", 1, 2, "PO1234", "65.192.14.10");

    gw.setPaymentMethod({
      payment: "creditcard",
      ccnumber,
      ccexp,
      cvv,
    });

    gw.doSale({ amount });

    gw.setPaymentMethod({
      payment: "check",
      checkname: "Example User",
      checkaba: 123123123,
      checkaccount: 123123123,
      account_holder_type: "personal",
      account_type: "checking",
    });

    gw.doSale({
      amount,
    });
  }

  static doAuth() {
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Response was", response);
      if (response.type === "auth") exp.doCapture(response);
    });

    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");

    gw.setBilling({
      first_name: "John",
      last_name: "Smith",
      company: "Acme, Inc.",
      address1: "123 Main St",
      address2: "Suite 200",
      city: "Beverly Hills",
      state: "CA",
      zip: "90210",
      country: "US",
      phone: "555-555-5555",
      fax: "555-555-5556",
      email: "support@example.com",
      website: "www.example.com",
    });

    gw.setShipping({
      shipping_first_name: "Mary",
      shipping_last_name: "Smith",
      shipping_company: "na",
      shipping_address1: "124 Shipping Main St",
      shipping_address2: "Suite Ship",
      shipping_city: "Beverly Hills",
      shipping_state: "CA",
      shipping_zip: "90210",
      shipping_country: "US",
      shipping_email: "support@example.com",
    });

    gw.setOrder("1234", "Big Order", 1, 2, "PO1234", "65.192.14.10");
    var amount = "50.00";
    var ccnumber = "4111111111111111";
    var ccexp = "1010";
    var cvv = "";

    gw.setPaymentMethod({
      payment: "creditcard",
      ccnumber,
      ccexp,
      cvv,
    });

    gw.doAuth({
      amount,
    });
  }

  doCapture(transaction) {
    console.log("Capture Transaction Start.", transaction);
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Capture Response was", response);
    });
    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");
    gw.doCapture(transaction.transactionid, "50.00");
  }

  static doCredit() {
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Response was", response);
    });

    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");

    gw.setBilling({
      first_name: "John",
      last_name: "Smith",
      company: "Acme, Inc.",
      address1: "123 Main St",
      address2: "Suite 200",
      city: "Beverly Hills",
      state: "CA",
      zip: "90210",
      country: "US",
      phone: "555-555-5555",
      fax: "555-555-5556",
      email: "support@example.com",
      website: "www.example.com",
    });

    gw.setShipping({
      shipping_first_name: "Mary",
      shipping_last_name: "Smith",
      shipping_company: "na",
      shipping_address1: "124 Shipping Main St",
      shipping_address2: "Suite Ship",
      shipping_city: "Beverly Hills",
      shipping_state: "CA",
      shipping_zip: "90210",
      shipping_country: "US",
      shipping_email: "support@example.com",
    });

    gw.setOrder("1234", "Big Order", 1, 2, "PO1234", "65.192.14.10");

    var amount = "50.00";
    var ccnumber = "4111111111111111";
    var ccexp = "1010";
    var cvv = "";

    gw.setPaymentMethod({
      payment: "creditcard",
      ccnumber,
      ccexp,
      cvv,
    });

    gw.doCredit({ amount });

    gw.setPaymentMethod({
      payment: "check",
      checkname: "Example User",
      checkaba: 123123123,
      checkaccount: 123123123,
      account_holder_type: "personal",
      account_type: "checking",
    });

    gw.doCredit({ amount });
  }

  static doSaleWithVoid() {
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Response was", response);
      exp.doViod(response);
    });

    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");

    gw.setBilling({
      first_name: "John",
      last_name: "Smith",
      company: "Acme, Inc.",
      address1: "123 Main St",
      address2: "Suite 200",
      city: "Beverly Hills",
      state: "CA",
      zip: "90210",
      country: "US",
      phone: "555-555-5555",
      fax: "555-555-5556",
      email: "support@example.com",
      website: "www.example.com",
    });

    gw.setShipping({
      shipping_first_name: "Mary",
      shipping_last_name: "Smith",
      shipping_company: "na",
      shipping_address1: "124 Shipping Main St",
      shipping_address2: "Suite Ship",
      shipping_city: "Beverly Hills",
      shipping_state: "CA",
      shipping_zip: "90210",
      shipping_country: "US",
      shipping_email: "support@example.com",
    });

    gw.setOrder("1234", "Big Order", 1, 2, "PO1234", "65.192.14.10");
    var amount = "50.00";
    var ccnumber = "4111111111111111";
    var ccexp = "1010";
    var cvv = "";

    gw.setPaymentMethod({
      payment: "creditcard",
      ccnumber,
      ccexp,
      cvv,
    });

    gw.doSale({ amount });
  }

  doViod(transaction) {
    console.log("Void Transaction Start.", transaction);
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Void Response was", response);
    });
    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");
    gw.doVoid(transaction.transactionid);
  }

  static doSaleWithRefund() {
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Response was", response);
      exp.doRefund(response);
    });

    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");

    gw.setBilling({
      first_name: "John",
      last_name: "Smith",
      company: "Acme, Inc.",
      address1: "123 Main St",
      address2: "Suite 200",
      city: "Beverly Hills",
      state: "CA",
      zip: "90210",
      country: "US",
      phone: "555-555-5555",
      fax: "555-555-5556",
      email: "support@example.com",
      website: "www.example.com",
    });

    gw.setShipping({
      shipping_first_name: "Mary",
      shipping_last_name: "Smith",
      shipping_company: "na",
      shipping_address1: "124 Shipping Main St",
      shipping_address2: "Suite Ship",
      shipping_city: "Beverly Hills",
      shipping_state: "CA",
      shipping_zip: "90210",
      shipping_country: "US",
      shipping_email: "support@example.com",
    });

    gw.setOrder("1234", "Big Order", 1, 2, "PO1234", "65.192.14.10");
    var amount = "50.00";
    var ccnumber = "4111111111111111";
    var ccexp = "1010";
    var cvv = "";

    gw.setPaymentMethod({
      payment: "creditcard",
      ccnumber,
      ccexp,
      cvv,
    });
    
    gw.doSale({ amount });
  }

  doRefund(transaction, amount = "50.00") {
    console.log("Refund Transaction Start.", transaction);
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Refund Response was", response);
    });
    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");
    gw.doRefund(transaction.transactionid, amount);
  }

  static createInvoice() {
    console.log("Create Invoice Start.");
    const exp = new Example();
    const gw = new gwapi((_response) => {
      var response = exp.splitResult(_response);
      console.log("The Refund Response was", response);
    });
    gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");
    
    gw.setBilling({
      first_name: "John",
      last_name: "Smith",
      company: "Acme, Inc.",
      address1: "123 Main St",
      address2: "Suite 200",
      city: "Beverly Hills",
      state: "CA",
      zip: "90210",
      country: "US",
      phone: "555-555-5555",
      fax: "555-555-5556",
      email: "support@example.com",
      website: "www.example.com",
    });

    gw.setShipping({
      shipping_first_name: "Mary",
      shipping_last_name: "Smith",
      shipping_company: "na",
      shipping_address1: "124 Shipping Main St",
      shipping_address2: "Suite Ship",
      shipping_city: "Beverly Hills",
      shipping_state: "CA",
      shipping_zip: "90210",
      shipping_country: "US",
      shipping_email: "support@example.com",
    });

    gw.setOrder("1234", "Big Order", 1, 2, "PO1234", "65.192.14.10");
    var amount = "50.00";
    
    gw.createInvoice({
      payment_terms: "upon_receipt",
      payment_methods_allowed : "cc,ck,cs",
      amount,
      customer_id : "123456-abcd-1234-1234abc",
      //customer_tax_id,
      currency : 'USD',
      //merchant_defined_field_1,
      //merchant_defined_field_2,
      //merchant_defined_field_3,
      //merchant_defined_field_4,
      //merchant_defined_field_5,
      //merchant_defined_field_6,
      //merchant_defined_field_7,
      //merchant_defined_field_8,
      //merchant_defined_field_9,
      //merchant_defined_field_10,
      //merchant_defined_field_11,
      //merchant_defined_field_12,
      //merchant_defined_field_13,
      //merchant_defined_field_14,
      //merchant_defined_field_15,
      //merchant_defined_field_16,
      //merchant_defined_field_17,
      //merchant_defined_field_18,
      //merchant_defined_field_19,
      //merchant_defined_field_20,
    });
  }

  static testPaymentDetails = gwapi.testPaymentDetails;
}

//Example.doSale();
//Example.doAuth();
//Example.doCredit();
//Example.doSaleWithVoid();
//Example.doSaleWithRefund();
Example.createInvoice();