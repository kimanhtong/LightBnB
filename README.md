# LightBnB
Lighthouse BnB is a multi-page web-app for homeowners to rent out their homes to people. Users can view property information, book reservations, view their reservations, and write reviews. 

## Final Product

!["Home Page"](https://github.com/kimanhtong/LightBnB/blob/master/images/Home_Page.png)
!["Listing Creation Page"](https://github.com/kimanhtong/LightBnB/blob/master/images/Listing_Creation_Page.png)
!["My Listings Page"](https://github.com/kimanhtong/LightBnB/blob/master/images/My_Listings_Page.png)
!["My Reservations Page"](https://github.com/kimanhtong/LightBnB/blob/master/images/My_Reservations_Page.png)

## Dependencies

- Node
- Express
- bcrypt
- body-parser
- cookie-session
- nodemon
- sass

## Getting Started

- In the folder `LightBnB_WebApp-master`, install all dependencies as following:
  - Node: `nvm install node`
  - Express: `npm install express`
  - bcrypt: `npm install bcrypt`
  - body-parser: `npm install body-parser`
  - cookie-session: `npm install cookie-session`
  - nodemon: `npm install nodemon`
  - sass: `npm install sass`

- Still in the folder `LightBnB_WebApp-master`, run the development web server using the `npm run local` or `npm start` command.
- Launch `http://localhost:8080` website, register an account, and log in. The account `piperphelps@live.com` can also be used for more available data.
- The project uses PostgreSQL installed and configured in the Vagrant VM. To access this database: in LightBnB folder, type `psql` to log on and then type `\c lightbnb` to connect to the database.