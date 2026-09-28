# Recommendation Quality Lab

An independent portfolio project by Shria Parupudi that demonstrates how an e-commerce recommendation experience can be evaluated across relevance, constraint satisfaction, explanation quality, purchase readiness, and variety.

## What this project solves

Recommendation systems can produce plausible suggestions while still missing a shopper's budget, use case, timing, or other hard constraints. This dashboard turns those qualitative outcomes into a consistent evaluation framework so teams can identify strengths, recurring failure modes, and opportunities for improvement.

## Methodology

Each recommendation is scored from 0–5 using five weighted criteria:

- Constraint satisfaction: 30%
- Relevance: 25%
- Purchase readiness: 20%
- Explanation quality: 15%
- Variety: 10%

The weighted score is converted to a 0–100 scale. A recommendation is considered successful when its composite score is at least 70 and its constraint score is at least 4.

## Data and limitations

This project uses a fictional e-commerce setting. All displayed results are synthetic sample data created solely to demonstrate the methodology and dashboard. They are not measurements of any real company or product. Findings are descriptive and should not be interpreted as causal.

## Run locally

Download the repository and open `index.html` in a browser. No installation, database, authentication, or ChatGPT login is required.

## Deploy

This is a static website. Import the GitHub repository into Vercel, leave the framework preset as **Other**, leave the build command blank, and deploy.

## Files

- `index.html` — dashboard structure and content
- `styles.css` — responsive visual design
- `app.js` — sample data, scoring, aggregation, filtering, and charts

---

Independent portfolio project by Shria Parupudi.
