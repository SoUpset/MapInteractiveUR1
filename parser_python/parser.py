#!/usr/bin/python
# coding: utf-8

from bs4 import BeautifulSoup
import requests
import csv

"""
APPLICATION DE CONSULTATION ET CARTOGRAPHIE DES ÉTABLISSEMENTS DU SYSTÈME ÉDUCATIF FRANÇAIS
"""
global lien, UR1, dic_base
lien="https://www.education.gouv.fr/acce_public/"
UR1="https://www.education.gouv.fr/acce_public/uai.php?uai=%2505%25B4%25ED%25E9%2595%2528%25C5%25A6%25EE%25FF%2598M%255B%2511%2500h"
dic_base={"Sigle" : 0, "Dénomination principale":1,"Patronyme":2,"Complément d’adresse":3,"Adresse":4,"Lieu dit":5,"Acheminement":5,"Nature":6,"Niveau":7,"Catégorie juridique":8}

"""
href_uai_search : retourne une liste de href et une liste de UAI associée permettant d'identifier chaque composante de l'UR1
"""
def href_uai_search():
	request = requests.get(UR1)
	liste_href,liste_uai=[],[]
	soup = BeautifulSoup(request.content, 'html.parser')
	for link in soup.find_all('a') :
		if(str(link.get('href')[:12])=="uai.php?uai="):
			liste_href.append(link.get('href'))
			liste_uai.append(link.text.strip())
	return(liste_href,liste_uai)

"""
souping : retourne la soup selon le href donné en paramètre
"""
def souping(href):
	#href="uai.php?uai=%251B%25B0%25A6%2518A%25C4%25DE%257FS6%25A69%25CB%25C5M%25B1"
	html=lien+href
	request = requests.get(html)
	liste=[]
	soup = BeautifulSoup(request.content, 'html.parser')
	return(soup)

"""
info_search : retourne la liste d'informations proposé en fonction d'un href 
(signe, dénomination principale, Patronyme, adresse, acheminement, naure, niveau, catégorie juridique)
"""
def info_search_corps(soup):
	liste=["?"]*len(dic_base)
	soup_corps=soup.find_all(class_="corps")
	soup_intro=soup.find_all(class_="intro")
	for index in range(0,len(soup_corps)-2):
		intro=soup_intro[index].text.strip()
		if(intro!=("Aucune spécificité")):
			element=soup_corps[index].text.strip()
			index_liste=dic_base[intro]
			liste[index_liste]=element
	return(liste[0:len(liste)-1])

"""
info_search_col : renvoie le numéro de téléphone et le site selon le href donné en paramètre (s'il n'y en a pas renvoie un "?")
"""
def info_search_col(soup):
	soup_colgauche=soup.find_all(class_="colgauche")
	telephone,site="?","?"
	for index in range(0,len(soup_colgauche)):
		string=soup_colgauche[index].text.strip()
		if("Tél :" in string):
			telephone=string[6::]
		elif("Site" in string):
			site=string[11::]
	return(telephone, site)

"""
automate : retourne une liste de liste contenant les lignes d'informations à écrire dans le documents .csv final
"""
def automate():
	liste=[]
	liste_href, liste_uai=href_uai_search()
	for index in range(0,len(liste_href)):
		href=liste_href[index]
		uai=liste_uai[index]
		soup=souping(href)
		liste_1=info_search_corps(soup)
		liste_2=info_search_col(soup)
		liste.append([uai]+list(liste_1)+list(liste_2))
	return(liste)

"""
Ecrit chaque ligne d'informations sur le document "document_iniformations.csv"
"""
with open('document_informations.csv','w',newline='', encoding='UTF8') as doc :
	writer=csv.writer(doc)
	writer.writerow(list(dic_base)+["Téléphone", "Site"])
	liste_informations=automate()
	writer.writerows(liste_informations)
