# Project ERIN
ERIN is a WikiLeaks Clone that will be focused to raise the voice of People whose intent is to share/leak public data and reveal secrets of unknown unaimously decided body. We aim to help them share intel, data etc. freely without worrying about licensing, media or getting arrested.

## Installation (CURRENTLY IN BETA)

Use the package manager [git](https://git-scm.com/) to locally clone ERIN. 

```bash
git clone https://github.com/qwertdev13/erin.git
```

Install [NodeJS](https://nodejs.org/en) on your device.

## Usage
Make sure, you have [Node.js](https://nodejs.org/en) v22 or later installed on your device.
After Cloning the Repository, run this cmd.
```python
cd erin 
```
To Install Dependecies
```bash
npm i express bcrypt nodemon
```

To initialize the database for user data storage, RUN
```python
echo "[]" > users.json
```
Then, to run the website simply RUN:
```python
npm run start ( NOTE: The default 'start' script uses nodemon )

   OR

npm run ndrun ( NOTE: The 'ndrun' script utilizes the nodejs default package manager to run the website. ) 
```


## Copy ? Paste Terminal Script
```bash
cd erin
npm i express bcrypt nodemon
echo "[]" > users.json
npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.


## License

[MIT](https://choosealicense.com/licenses/mit/)
