#
# Copyright 2014 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Katello
module Glue
  # triggering events on model creation/deletion for better
  # extendability.
  # TODO: This will be removed after moving the orchestration into
  #       Dynflow actions completely
  module Event

    class << self
      def included(base)
        base.class_eval do
          after_create :trigger_create_event
          after_commit :execute_action
          before_destroy :trigger_destroy_event
        end
      end

      attr_accessor :disabled
      alias_method :disabled?, :disabled
    end

    def trigger_create_event
      plan_action(create_event, self) if create_event
      return true
    end

    def trigger_destroy_event
      plan_action(destroy_event, self) if destroy_event
      return true
    end

    # define the Dynflow action to be triggered after create
    def create_event
    end

    # define the Dynflow action to be triggered before destroy
    def destroy_event
    end

    def plan_action(event_class, *args)
      return if Glue::Event.disabled?
      @execution_plan = ::ForemanTasks.dynflow.world.plan(event_class, *args)
      fail @execution_plan.errors.first if @execution_plan.error?
    end

    def execute_action
      if @execution_plan
        ::ForemanTasks.dynflow.world.execute(@execution_plan.id)
      end
      return true
    end

    def self.trigger(event_class, *args)
      return if Glue::Event.disabled?
      ::ForemanTasks.sync_task(event_class, *args)
    end
  end
end
end
