# Typescript Boilerplate

This is my boilerplate for Typescript projects in Covalence. Below is a function definition for others to add to their `~/.bashrc` (or shell of their choice) that will allow cloning this project (Github OAuth token required), creating a new repo locally out of that, and setting it up remotely, so that one can get everything setup with a simple `new-tsproj $project-name $project-description (optional)`.

Requirements:
  - Substitute `$YOUR_TOKEN_HERE` with the OAuth token you obtained from Github
  - Substitute `$YOUR_USERNAME_HERE` with your username.
  - (Optional) - uncomment and change the cd command to create the new repo in your source directory

Sample usages:
  - `new-tsproj 'foodtruck-finder' 'Foodtruck locator written in Typescript'`
  - `new-tsproj twitter-for-cats`

```shell
new-tsproj() {
   # cd sourceDirectory/
   git clone git@github.com:atlc/ts-boilerplate.git
   mv ts-boilerplate $1 && cd $1 && rm -rf .git && git init
   curl -v -H "Authorization: token $YOUR_TOKEN_HERE" https://api.github.com/user/repos -d "{\"name\": \"$1\", \"description\": \"$2\"}"
   git remote add origin git@github.com:$YOUR_USERNAME_HERE/$1.git
   npm install
}
```