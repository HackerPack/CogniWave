from firebase import firebase
firebase = firebase.FirebaseApplication('https://cogniwave.firebaseio.com/')
data={'email':'dk@gmail','message':'imp msg'}

result = firebase.put('/Messages','data',data)
#result = firebase.put('/users', "shivani@gmail.com", {'print': 'pretty'}, {'X_FANCY_HEADER': 'VERY FANCY'})
print result