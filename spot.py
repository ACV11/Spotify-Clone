# from tekore.util import request_client_token

# client_id = '93fdf705f11c4cd3b62fd0641acddcb0'
# client_secret = '295a86e7a3d14882a713da04c63703e2'

# app_token = request_client_token(client_id, client_secret)
# from tekore import Spotify

# spotify = Spotify(app_token)

# album = spotify.track('14msK75pk3pA33pzPVNtBF')
# # for track in album.tracks.items:
# #     print(track.track_number, track.name)
# s = spotify.track('14msK75pk3pA33pzPVNtBF')
# s = spotify.playback('14msK75pk3pA33pzPVNtBF')
# print(s)
# import spotipy
# from spotipy.oauth2 import SpotifyClientCredentials
# cid = '93fdf705f11c4cd3b62fd0641acddcb0'
# secret = '295a86e7a3d14882a713da04c63703e2'
# client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
# sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)



# # birdy_uri = 'spotify:artist:2WX2uTcsvV5OnS0inACecP'
# # spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

# # results = spotify.artist_albums(birdy_uri, album_type='album')
# # albums = results['items']
# # while results['next']:
# #     results = spotify.next(results)
# #     albums.extend(results['items'])

# # for album in albums:
# #     print(album['name'])
# # artist_name = []
# # track_name = []
# # popularity = []
# # track_id = []
# # for i in range(0,1000,50):
# #     track_results = sp.search(q='year:2018', type='track', limit=50,offset=i)
# #     for i, t in enumerate(track_results['tracks']['items']):
# #         artist_name.append(t['artists'][0]['name'])
# #         track_name.append(t['name'])
# #         track_id.append(t['id'])
# #         popularity.append(t['popularity'])
# '2WX2uTcsvV5OnS0inACecP'
# '14msK75pk3pA33pzPVNtBF'
# birdy_uri = 'spotify:track:2WX2uTcsvV5OnS0inACecP'
# results = sp.artist_albums(birdy_uri, album_type='album')
# # albums = results['items']
# # while results['next']:
# #     results = spotify.next(results)
# #     albums.extend(results['items'])
# print(results)

from flask import Flask, render_template, jsonify,request,abort,Response
import sqlalchemy as sql
from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
import requests
import json
from random import randint
import csv
from datetime import datetime as dt
import re
import pandas

engine = sql.create_engine('sqlite:///database.db', echo=True)
app=Flask(__name__)

meta = sql.MetaData()
user_details = Table('UserDetails', meta,
    Column('username', String, primary_key=True),
    Column('password', String),
    Column('playlist', String),)

playlist_details = Table('PlayDetails',meta,
    Column('playname',String, primary_key=True),
    Column('songs',String),)

meta.create_all(engine)

def userExists(name):
    print("\n"*10, "In userExists()")
    conn = engine.connect()
    res = conn.execute("SELECT * FROM UserDetails WHERE username=$name", name)
    res = list(res)
    if len(res) > 0:
        return True
    return False




@app.route("/api/v1/users", methods=["PUT"])
def add_user():
    bad_request = False
    userinfo = request.get_json()
    try:
        username = userinfo["username"]
        password = userinfo["password"]
        # playlist="none"
        print(username,password)
        if not userExists(username):
            conn = engine.connect()
            query = "INSERT INTO UserDetails(username,password)values('"+username+"','"+password+"');"
            conn.execute(query)
    # print("HERE:", r.status_code)
            return jsonify({}), 201
        else:							# Invalid username / password
            bad_request = True
    except KeyError:					# Invalid JSON input
        bad_request = True
    if bad_request:
        abort(400)

@app.route("/api/v1/playlist", methods=["PUT"])
def add_playlist():
    bad_request = False
    userinfo = request.get_json()
    try:
        username = userinfo["username"]
        playlist = userinfo["playlist"]
        s= playlist
        print(username,playlist)
        if userExists(username):
            conn = engine.connect()
            res = conn.execute("SELECT playlist FROM UserDetails WHERE username=$name", username)
            l = list(list(res)[0])
            print(l)
            if playlist in l:
                abort(400)
            else:
                conn.execute
                for i in l:
                    playlist= playlist+str(",")+ str(i)
                # print(str(l))
                conn.execute("UPDATE UserDetails SET playlist=$playlist WHERE username=$username",playlist,username)
                conn.execute("INSERT INTO PlayDetails(playname)values('"+str(username+s)+"');")
            return jsonify({}), 201
        else:							# Invalid username / password
            bad_request = True
    except KeyError:					# Invalid JSON input
        bad_request = True
    if bad_request:
        abort(400)

@app.route("/api/v1/addsong", methods=["PUT"])
def add_song():
    bad_request = False
    userinfo = request.get_json()

    try:
        username = userinfo["username"]
        playlist_name = userinfo["playlist"]
        song_name = userinfo["song"]
        print(username,playlist_name,song_name)
        conn = engine.connect()
        res = conn.execute("SELECT songs FROM PlayDetails WHERE playname=$playname",str(username+playlist_name))
        l = list(list(res)[0])
        print(l)
        if song_name in l:
            abort(400)
        else:
            for i in l:
                song_name= song_name+str(",")+ str(i)
                print(song_name)
        # conn = engine.connect()
        conn.execute("UPDATE PlayDetails SET songs=$song WHERE playname=$username",str(song_name),str(username+playlist_name))
        return jsonify({}), 201
    except KeyError:					# Invalid JSON input
        bad_request = True
    if bad_request:
        abort(400)



@app.route("/api/v1/searchsong",methods=["GET"])
def searchsong():
    df = pandas.read_csv('popular.csv')
    df.dropna(inplace = True)
    info = request.get_json()
    sub = info["search"]
    # print(sub)
    l = list()
    for i in df['track_name']:
        if sub in i:
            l.append(i)
    return json.dumps(l)

if __name__ == '__main__':	
    app.debug=True
    app.run()