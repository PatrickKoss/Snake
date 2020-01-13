try:
    import json
except ImportError:
    import simplejson as json

import tweepy
import os
import time
import pandas as pd

# set the consumer key and access token from the local windows environment
consumer_key = '0hxqbbVnyVY4S9VNf8KbYBq2d'
consumer_key_secret = 'dWBxoeKfO8HKZ6d2Uky17yEQ4GMds1PqPnIR8jHLzroZeBrzF7'
access_token = '752785227660070912-rGyBrNfUm933vUnn8pJc167UTSNUgwk'
access_token_secret = 'QQTZpiqvoAE2E0t74AkgaMUh6jjaQyTxCy5UH6WbocQRg'

# create the auth for tweepy
auth = tweepy.OAuthHandler(consumer_key, consumer_key_secret)
auth.set_access_token(access_token, access_token_secret)

# set the api
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True, compression=True)


def get_recent_tweets():
    tweets = []
    counter = 0
    try:
        for tweet in tweepy.Cursor(api.search, q='*', count=100, lang='en', since='2017-06-20',
                                   tweet_mode='extended').items():
            # if the tweet is a retweet then add the original tweet to the dataset otherwise add the tweet
            if "retweeted_status" in tweet._json:
                tweets.append(tweet._json['retweeted_status']['full_text'])
            else:
                tweets.append(tweet._json['full_text'])
            counter += 1

            if counter == 200:
                time.sleep(2)
                break
    except:
        for i in range(0, 11):
            tweets.append("timeout")

    return tweets
