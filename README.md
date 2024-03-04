# JS2
## Globetrotter 
![GlobeTrotter](https://github.com/Tinberg/globetrotter/assets/126072224/a931d9c6-11fc-4d9f-98ff-8c55ba8a7725)

## Description

Welcome to Globetrotter, an engaging social media platform dedicated to travel enthusiasts around the globe. Developed as a project for the Javascript course (JS2). Globetrotter allows users to share their travel experience and discover new destinations. 

#### Home page
The Home Page shows the latest travel posts from users you follow.

#### Explore
The Explore page shows the latest travel posts. The page features a robust search function that allows you to discover both posts and profiles. Additionally, the page is equipped with a "Sort By" feature and a continent filter, enabling you to navigate through the content based on your preferences.

#### My Profile
Create and customize your profile, share stories, photos, and tips. You can also visit other travelers profiles to get inspired.

#### Post
The post specific page is a dedicated page for each post, featuring detailed post image description and interactions options.


### API limitations 
- react modal do not contain avatar img bcs of no avatar img in the respons.
- All comments on a post a user has made can not be delete(only comment the logged in user has created), but the icon is still there.
- profile and my-profile do not show the right count on reactions on posts bcs of missing reactors array from query parameter. but on all other pages it shows one like pr username. 

- The design is responsive, powered by Bootstrap.
- Noroff API integration: We have integrated posts from students across the Noroff network, using an API powered by Noroff.

## Built With 

![317755_badge_html_html5_achievement_award_icon (1)](https://github.com/Tinberg/Rainydays/assets/126072224/38fa6731-648a-4696-a360-2333939feb36)  ![317756_badge_css_css3_achievement_award_icon](https://github.com/Tinberg/Rainydays/assets/126072224/1f673d3c-9820-481f-9610-3d22010c8359) 
![4373213_js_logo_logos_icon](https://github.com/Tinberg/Rainydays/assets/126072224/d877fa5d-c0f7-4dd0-beab-cca0b7c02da5) ![bootstrap](https://github.com/Tinberg/css-frameworks-ca/assets/126072224/c9dd8196-af4b-440e-847a-d43f5b1f17fb)![sass](https://github.com/Tinberg/css-frameworks-ca/assets/126072224/f0fd1e63-9e5a-4b43-a038-df57a4136287)

## Getting Started

## Prerequisites

Before running the application, make sure you have Node.js and npm installed on your system. You can check their versions by running the following commands in your terminal:

```bash
node -v
npm -v
```

### Installing

1. Clone the repo:

```bash
git clone git@github.com:Tinberg/globetrotter.git
```
2. Install the dependencies:

```bash
npm install bootstrap@5.3.2

```

```bash
npm install live server

```
### CDN
Bootstrap JS:
```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
  integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
  crossorigin="anonymous"
></script>
```
## Running

3. To run the app, use the following command:

```bash
npm run dev

```
## Custom Sass Styles

Customize the application's styles by modifying the Sass files in the `src/scss/` directory. After making changes, run `npm run build` to compile the Sass into the `dist/css` directory.

## Contact me

[![386655_linkedin_linked in_icon](https://github.com/Tinberg/Rainydays/assets/126072224/ec1dfc29-cc5c-4c56-90c0-7c4b4808ba1c)](https://www.linkedin.com/in/mathias-tinberg-a13147113/)
