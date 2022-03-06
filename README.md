# Ecommerce project

I'm currently working in a ecommerce company so I thought it would be fitting to make an ecommerce website.

Tbh, I have trouble visualizing/planning the entire project from scratch since I'm still quite a beginner so I'm following a course but I plan to make extensive changes to the project as I follow the course.

Some stuff I have in mind for now:

- adding tests for backend and frontend
- consistent formatting with black
- adding CI/CD
- redoing the architecture of the backend(doing it as I write the backend)
- rewriting the frontend in typescript(this is low on priority)
- Docker and Docker Compose

As I was doing the project I found some problems in the frontend which I fixed and I got some ideas for new features after observing my own workplace's ecommerce webapp features.

Bug fixes

- Properly add to cart instead of overwriting cart state

New features added(compared to original code):

- modal pop-up when added to cart
- Use number input instead of dropdown for quantity select

Extra features I'm thinking of:

- discount feature(admin and user)
  - admin add discounts directly
  - user uses discount codes if given
- product mass upload, edit, download feature(admin)
- upgrading to React Router 6
