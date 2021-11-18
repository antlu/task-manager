require 'date'

DAYS = 100

FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password] do |n|
    "string#{n}"
  end

  sequence(:email) { |n| "person#{n}@example.com" }

  sequence :date do
    Date.today + rand(-DAYS..DAYS)
  end
end
