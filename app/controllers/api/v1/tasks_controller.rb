class API::V1::TasksController < API::V1::ApplicationController
  respond_to :json

  def index
    tasks = Task.all
                .ransack(ransack_params)
                .result
                .page(page)
                .per(per_page)
    respond_with(tasks, each_serializer: TaskSerializer, root: 'items', meta: build_meta(tasks))
  end

  def show

  end

  def create

  end

  def update

  end

  def destroy

  end
end
