# Frontend Mentor - Advice generator app solution

This is a solution to the [Advice generator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/advice-generator-app-QdUG-13db).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Generate a new piece of advice by clicking the dice icon

### Screenshot

![App image](./images/screenshot-app.jpg)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript

### What I learned

I learned a lot while working on this challenge. Initially, I only wanted to practice consuming the API, but I noticed in the documentation that it only supports the GET HTTP method. This led me to the idea of creating a functionality that allows users to save their favorite pieces of advice if they want to. Since the API doesn’t have a POST HTTP method, I used the browser’s local storage to achieve this.

Although the challenge doesn’t require this feature, I thought it was worth trying to implement it. Local storage is a feature of the browser and a property of the window interface. It allows us to store data persistently, meaning the data remains even if you close your browser. This feature distinguishes local storage from other types of storage like session storage, which only stores data while the tab is open.

I used local storage like a mini-database. Since the data being stored are just short strings and numbers (the pieces of advice and their IDs), local storage can handle it correctly without causing a memory collapse.

### Continued development

I want it to keep improving on API consume in more complex ways.

### Useful resources

- [MDN-localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - As always, the mozilla documentation never dissapoints.

## Author

- Frontend Mentor - [@santiagodev10](https://www.frontendmentor.io/profile/santiagodev10)
- Twitter - [@santiagoDev10](https://x.com/santiagoDev10)