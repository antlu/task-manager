FactoryBot.define do
  factory :task do
    name { generate(:string) }
    description { generate(:string) }
    author { association :manager }
    assignee { association :developer }
    state { generate(:string) }
    expired_at { generate(:date) }
  end
end
