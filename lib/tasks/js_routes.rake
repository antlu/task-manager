# frozen_string_literal

require 'js-routes'

namespace :js_routes do
  desc 'Generate js routes for webpack'
  task generate: :environment do
    JsRoutes.generate!('routes/ApiRoutes.js', camel_case: true)
  end
end
