from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button

import requests

#@login_required()
def home(request):
    """
    Controller for the app home page.
    """

    context = {
    }

    return render(request, 'sonic_test/home.html', context)

def get_hydrographs(request):

    get_data = request.GET
    # get stream attributes
    comid = get_data['comid']
    region = get_data['region']
    subbasin = get_data['subbasin']
    watershed = get_data['watershed']

    print(comid)

    print(region)

    context = {

    }

    return render(request, 'sonic_test/gizmo_ajax.html', context)