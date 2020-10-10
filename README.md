# NMI-DirectPay-GWAPI #
### Setup ###
`npm i https://github.com/dreamingrainbow/NMI-DirectPay-GWAPI`

### Usage: ###

#### Initialize the GWAPI Instance with a callback. ####
```JavaScript
const gw = new gwapi((responses) => {
  const _responses = {};
  responses.split('&').forEach(response => {
    const r = response.split("=");
    _responses[r[0]] = r[1];
  })
  console.log(_responses);
});
```

#### Set the merchant secure token ####
```JavaScript
gw.setLogin("6457Thfj624V5r7WUwc5v6a68Zsd6YEm");
```

#### Set the client billing information ####
```JavaScript
gw.setBilling(
  "John",
  "Smith",
  "Acme, Inc.",
  "123 Main St",
  "Suite 200",
  "Beverly Hills",
  "CA",
  "90210",
  "US",
  "555-555-5555",
  "555-555-5556",
  "support@example.com",
  "www.example.com"
);
```

#### Set the client shipping information ####
```JavaScript
gw.setShipping(
  "Mary",
  "Smith",
  "na",
  "124 Shipping Main St",
  "Suite Ship",
  "Beverly Hills",
  "CA",
  "90210",
  "US",
  "support@example.com"
);
```

#### Set the order details. ####
```JavaScript
gw.setOrder("1234", "Big Order", 1, 2, "PO1234", "65.192.14.10");
```
#### Process the sale ####
```JavaScript
gw.doSale("50.00", "4111111111111111", "1010");
```
