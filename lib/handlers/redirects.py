# coding=utf-8


# Copyright 2015 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import webapp2

class HomePageRedirect(webapp2.RequestHandler):
  def get(self):
    return webapp2.redirect('/', True)

class EmbedApiRedirect(webapp2.RequestHandler):
  def get(self):
    return webapp2.redirect('/embed-api/', True)


class QueryExplorerCsvRedirect(webapp2.RequestHandler):
  def get(self):
    q = '?' + self.request.query_string if self.request.query_string else ''
    return webapp2.redirect('/query-explorer/csvhandler' + q, True)


class QueryExplorerRedirect(webapp2.RequestHandler):
  def get(self):
    q = '?' + self.request.query_string if self.request.query_string else ''
    return webapp2.redirect('/query-explorer/' + q, True)
