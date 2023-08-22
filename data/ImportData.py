import requests
from pymongo import MongoClient
import csv
import os
from dotenv import load_dotenv

# client = MongoClient()
# db = client['spelling-api']
# collection = db['words']


def GetWordInfo(word):
    url = "https://wordsapiv1.p.rapidapi.com/words/" + word

    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers)

    return response.json()

csvfile = open('WordDifficulty.csv', 'r')
reader = csv.DictReader(csvfile)


# 0 words done so far

def main():
    failedWords = []
    count = 0
    for each in reader:
        word = each['Word']
        if count >= 700:
            break
        if count % 10 == 0:
            print(word, count)
        if word.istitle():
            continue
        
        try:
            wordInfo = GetWordInfo(word)
            row = {}

            row['word'] = word
            row['definition'] = wordInfo['results'][0]['definition']
            row['partOfSpeech'] = wordInfo['results'][0]['partOfSpeech']
            apiSentence = wordInfo['results'][0].get('examples', [None])[0]
            row['sentence'] = apiSentence
            row['zscore'] = each['I_Zscore']
            row['meanAccuracy'] = each['I_Mean_Accuracy']

            url = "http://localhost:3000/words/save"

            response = requests.post(url, json=row)
            if not response.ok:
                failedWords.append(word)
            # collection.insert_one(row)
        except Exception as e:
            print("Error for word: ", word, e)
            failedWords.append(word)
            continue
        count+=1

    print('failed words', failedWords)

main()