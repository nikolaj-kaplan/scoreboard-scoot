# GitHub Copilot Instructions

## Workflow Guidelines

### Git Operations
- **NEVER push changes automatically** - Always wait for the user to test changes before committing or pushing
- Only commit and push when explicitly requested by the user
- After making code changes, inform the user they can test and then request commit/push when ready

### Development Workflow
1. Make requested code changes
2. Inform user that changes are ready for testing
3. Wait for user confirmation after testing
4. Only then proceed with git operations if requested

### Starting the app
Don't start or stop the app. Ask the user to start the app, if it is time to verify changes.

## Project-Specific Notes

This is a Next.js scoreboard application with:
- Real-time updates via Pusher
- Google Sheets as data source
- Multiple overlay pages for video production
- Green screen (#00ff00) background for chroma keying
