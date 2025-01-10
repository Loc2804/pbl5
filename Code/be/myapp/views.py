from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.template import loader
@api_view(['GET'])
def hello_world(request):
    # return Response({"message": "Hello, DRF!"})
    return HttpResponse(loader.get_template('test1.html').render())

@api_view(['GET', 'POST'])
def users(request):
    if request.method == 'GET':
        users = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
        return Response(users)
    elif request.method == 'POST':
        data = request.data
        return Response({"received": data}, status=201)


